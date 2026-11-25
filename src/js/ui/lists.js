(() => {
  'use strict';
  // Keep the native nodes (including delayed view counters); one .day can hold several posts.
  function splitDays(flow, nextId) {
    for (const group of flow.querySelectorAll('.day:not(.ctp-post-row)')) {
      const titles = group.querySelectorAll(':scope > .postTitle');
      if (!titles.length) continue; // A native group may arrive before its entries.
      for (const title of titles) {
        const anchor = title.querySelector('a[href]');
        if (!anchor) continue;
        const row = document.createElement('article');
        row.className = 'day ctp-post-row';
        row.id = nextId();
        group.before(row);
        for (let node = title; node && !node.matches('.postSeparator');) {
          const next = node.nextElementSibling;
          row.append(node);
          if (next?.matches('.postTitle')) break;
          node = next;
        }
        const desc = row.querySelector('.c_b_p_desc[id]');
        if (desc) row.setAttribute('aria-describedby', desc.id);
      }
      if (!group.querySelector('.postTitle')) group.remove();
    }
  }
  function railIndex(railBody, label) {
    const title = document.createElement('p');
    title.className = 'ctp-rail-title'; title.textContent = label;
    const nav = document.createElement('nav');
    nav.className = 'ctp-page-index'; nav.setAttribute('aria-label', label);
    railBody.append(title, nav);
    let previous;
    return { update(items) {
      const signature = JSON.stringify(items);
      if (signature === previous) return;
      previous = signature;
      nav.replaceChildren(...items.map(({name, href}) => {
        const link = document.createElement('a'); link.href = href; link.textContent = name;
        return link;
      }));
    }, remove() { title.remove(); nav.remove(); } };
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
        if (child.matches('img')) {
          const src = child.getAttribute('src')?.trim();
          if (!src) continue;
          let url;
          try { url = new URL(src, location.href); } catch (_) { continue; }
          if (!['https:', 'http:'].includes(url.protocol)) continue;
          const img = document.createElement('img');
          img.alt = child.alt; img.loading = 'lazy'; img.src = url.href;
          for (const attr of ['width','height']) {
            const size = child.getAttribute(attr);
            if (size && /^\d+$/.test(size)) img.setAttribute(attr,size);
          }
          parent.append(img); continue;
        }
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
      if (!body.textContent.trim() && !body.querySelector('img')) { notice.remove(); return; }
      const title = document.createElement('h2'); title.textContent = '公告';
      notice.replaceChildren(title, body); railBody.prepend(notice);
    }
    update();
    if (config.notice.html) return () => notice.remove();
    const observer = new MutationObserver(update);
    observer.observe(document.querySelector('#sideBar') || document.documentElement, {subtree:true, childList:true, characterData:true});
    return () => { observer.disconnect(); notice.remove(); };
  }
  let stop;
  window.CTP.onPage(({content, kind, railBody, config}) => {
    stop?.(); stop = null;
    if (!['days','results','directory'].includes(kind)) return;
    const tags = Boolean(content.querySelector('#MyTag1_dtTagList'));
    const label = kind === 'directory' ? (tags ? '我的标签' : '随笔分类') : '本页文章';
    const index = railIndex(railBody, label);
    const stopNotice = kind !== 'directory' && mountNotice(railBody, config);
    let number = 0;
    function nextId() {
      let id;
      do { id = 'ctp-entry-' + ++number; } while (document.getElementById(id));
      return id;
    }
    function update() {
      if (kind === 'days') {
        splitDays(content, nextId);
        index.update(Array.from(content.querySelectorAll('.ctp-post-row .postTitle a[href]'), a =>
          ({name:a.textContent.trim(), href:'#' + a.closest('.ctp-post-row').id})));
      } else {
        const selector = kind === 'results' ? '.entrylistItemTitle[href], #myposts .postTitl2 a[href]' :
          tags ? '#MyTag1_dtTagList td[data-use-count] a[href]' : '.category-link-list .category-list-item a[href]';
        index.update(window.CTP.taxonomy.parse(content, selector, kind === 'directory'));
      }
    }
    const observer = new MutationObserver(update);
    observer.observe(content, {childList:true, subtree:true, characterData:true}); update();
    stop = () => { observer.disconnect(); index.remove(); if (stopNotice) stopNotice(); };
  });
})();
