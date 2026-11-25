(() => {
  'use strict';
  // Keep the native nodes (including delayed view counters); one .day can hold several posts.
  function splitDays(flow) {
    const posts = [];
    for (const group of flow.querySelectorAll('.day')) {
      for (const title of group.querySelectorAll(':scope > .postTitle')) {
        const anchor = title.querySelector('a[href]');
        if (!anchor) continue;
        const row = document.createElement('article');
        row.className = 'day ctp-post-row';
        row.id = 'ctp-entry-' + (posts.length + 1);
        group.before(row);
        for (let node = title; node && !node.matches('.postSeparator');) {
          const next = node.nextElementSibling;
          row.append(node);
          if (next?.matches('.postTitle')) break;
          node = next;
        }
        const desc = row.querySelector('.c_b_p_desc[id]');
        if (desc) row.setAttribute('aria-describedby', desc.id);
        posts.push({name:anchor.textContent.trim(), href:'#' + row.id});
      }
      if (!group.querySelector('.postTitle')) group.remove();
    }
    return posts;
  }
  function railIndex(railBody, label, items) {
    const title = document.createElement('p');
    title.className = 'ctp-rail-title'; title.textContent = label;
    const nav = document.createElement('nav');
    nav.className = 'ctp-page-index'; nav.setAttribute('aria-label', label);
    for (const {name, href} of items) {
      const link = document.createElement('a'); link.href = href; link.textContent = name;
      nav.append(link);
    }
    railBody.append(title, nav);
  }
  // Only display passive announcement markup. Copying the native subtree wholesale would
  // duplicate IDs, widgets and their event handlers in the new rail.
  function noticeMarkup(html) {
    const template = document.createElement('template'); template.innerHTML = html;
    const safe = document.createDocumentFragment();
    function copy(source, parent) {
      for (const child of source.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) { parent.append(child.textContent); continue; }
        if (child.nodeType !== Node.ELEMENT_NODE || /^(SCRIPT|STYLE|IFRAME|OBJECT|TEMPLATE|NOSCRIPT)$/.test(child.tagName)) continue;
        if (!/^(P|DIV|SPAN|BR|A|STRONG|EM|B|I|UL|OL|LI|CODE)$/.test(child.tagName)) { copy(child, parent); continue; }
        const clone = document.createElement(child.localName);
        if (child.matches('a[href]')) {
          try {
            const url = new URL(child.getAttribute('href'), location.href);
            if (['http:', 'https:', 'mailto:'].includes(url.protocol)) clone.href = url.href;
          } catch (_) {}
        }
        copy(child, clone); parent.append(clone);
      }
    }
    copy(template.content, safe); return safe;
  }
  function mountNotice(railBody, config) {
    const notice = document.createElement('section'); notice.className = 'ctp-notice';
    let previous;
    function update() {
      const html = config.notice.html || document.querySelector('#sidebar_news_content')?.innerHTML || '';
      if (html === previous) return;
      previous = html;
      const body = noticeMarkup(html);
      if (!body.textContent.trim()) { notice.remove(); return; }
      const title = document.createElement('h2'); title.textContent = '公告';
      notice.replaceChildren(title, body); railBody.prepend(notice);
    }
    update();
    if (config.notice.html) return;
    const observer = new MutationObserver(update);
    observer.observe(document.querySelector('#sideBar') || document.documentElement, {subtree:true, childList:true, characterData:true});
    return () => observer.disconnect();
  }
  let stop;
  window.CTP.onPage(({content, article, railBody, config}) => {
    stop?.();
    if (article) return;
    const posts = splitDays(content);
    if (posts.length) {
      railIndex(railBody, '本页文章', posts);
      stop = mountNotice(railBody, config);
      return;
    }
    const directory = content.querySelector('.category-link-list, #MyTag1_dtTagList');
    if (directory) {
      const isTags = directory.id === 'MyTag1_dtTagList';
      const items = window.CTP.taxonomy.parse(content, isTags ? '#MyTag1_dtTagList td[data-use-count] a[href]' : '.category-link-list .category-list-item a[href]');
      railIndex(railBody, isTags ? '我的标签' : '随笔分类', items);
      return;
    }
    if (content.querySelector('.category-crumb-item, #myposts')) {
      const items = window.CTP.taxonomy.parse(content, '.entrylistItemTitle[href], #myposts .postTitl2 a[href]', false);
      railIndex(railBody, '本页文章', items);
      stop = mountNotice(railBody, config);
    }
  });
})();
