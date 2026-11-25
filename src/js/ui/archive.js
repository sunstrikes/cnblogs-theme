(() => {
  'use strict';
  const data = window.CTP.archive;
  function node(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  }
  function renderPost(post) {
    const article = node('article','entrylistItem');
    const title = node('h3','entrylistPosttitle');
    const link = node('a','',post.title); link.href = post.href;
    title.append(link); article.append(title);
    if (post.summary) article.append(node('p','entrylistPostSummary',post.summary));
    if (post.meta) article.append(node('p','entrylistItemPostDesc',post.meta));
    return article;
  }
  function timeline(native, current, months, railBody) {
    const timeline = node('div','ctp-timeline');
    const title = node('h1','entrylistTitle','随笔归档');
    native.before(title, timeline);
    const nav = node('nav','ctp-page-index'); nav.setAttribute('aria-label','归档月份');
    railBody.append(node('p','ctp-rail-title','按月浏览'), nav);
    const records = new Map(), queue = [];
    let active = 0;
    function queueMonth(record, priority=false) {
      if (record.state === 'queued' && priority) queue.splice(queue.indexOf(record), 1);
      else if (record.state !== 'idle') return;
      record.state = 'queued';
      if (priority) queue.unshift(record); else queue.push(record);
      drain();
    }
    async function drain() {
      if (active >= 3 || !queue.length) return;
      active++;
      const r = queue.shift(); r.state = 'loading'; r.status.textContent = '正在加载文章…';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      try {
        const entries = await data.entries(r.item.href, controller.signal);
        r.list.replaceChildren(...entries.map(renderPost));
        if (!entries.length) r.list.append(node('p','','本月暂无文章。'));
        r.state = 'ready';
      } catch (_) {
        r.status.textContent = '本月文章暂未载入。';
        r.state = 'error';
        const retry = node('button','','重试'); retry.type = 'button';
        retry.onclick = () => { retry.remove(); r.state = 'idle'; queueMonth(r,true); };
        const direct = node('a','','打开原始月份'); direct.href = r.item.href;
        r.list.replaceChildren(r.status, retry, direct);
      } finally { clearTimeout(timer); active--; drain(); }
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        observer.unobserve(entry.target); queueMonth(records.get(entry.target));
      }
    });
    for (const item of months) {
      const section = node('section','ctp-month'); const id = 'ctp-month-' + item.key;
      section.id = id; const heading = node('h2','',item.label); heading.id = id + '-name';
      section.setAttribute('aria-labelledby',heading.id); section.append(heading); timeline.append(section);
      const link = node('a','',item.label); link.href = '#' + id; nav.append(link);
      const list = node('div','ctp-month-entries'); section.append(list);
      const status = node('p','ctp-month-status','尚未载入'); status.setAttribute('role','status');
      const record = {section, item, link, list, status, state:'idle'}; records.set(section, record);
      if (item.key === current.key) {
        list.append(native); native.querySelector('.entrylistTitle')?.setAttribute('hidden','');
        record.state = 'ready'; link.setAttribute('aria-current','location');
      } else { list.append(status); observer.observe(section); }
      link.addEventListener('click', () => { queueMonth(record,true); });
    }
    // The active month follows the reading line, including when the last section is short.
    let frame;
    function highlight() {
      frame = 0;
      const rows = [...records.values()];
      let first = rows[0];
      for (const r of rows) if (r.section.getBoundingClientRect().top <= 95) first = r;
      if (scrollY > 0 && Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight) first = rows.at(-1);
      for (const r of rows) if (r === first) r.link.setAttribute('aria-current','location'); else r.link.removeAttribute('aria-current');
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(highlight); };
    window.addEventListener('scroll',schedule,{passive:true});
    if (months[0].key !== current.key) document.getElementById('ctp-month-' + current.key)?.scrollIntoView();
    return () => { observer.disconnect(); window.removeEventListener('scroll',schedule); cancelAnimationFrame(frame); };
  }
  let stop;
  window.CTP.onPage(({content, railBody}) => {
    stop?.(); stop = null;
    const current = data.month(location.href), native = content.querySelector('.entrylist');
    if (!current || !native) return;
    const observer = new MutationObserver(mount);
    function mount() {
      const months = data.months();
      if (!months.length) return;
      if (!months.some(m => m.key === current.key)) months.unshift(current);
      observer.disconnect(); stop = timeline(native, current, months, railBody);
    }
    observer.observe(document.querySelector('#sideBar') || document.documentElement, {subtree:true, childList:true});
    stop = () => observer.disconnect(); mount();
  });
})();
