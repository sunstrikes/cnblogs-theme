(() => {
  'use strict';
  const {home} = window.CTP;
  const categories = '.category-block-list .category-link-list .category-list-item a[href]';
  // Parse only real same-origin anchors. Collections, albums and month counts
  // can appear under the same native sidebar parent and are not post categories.
  function parse(root, selector, withCount=true) {
    const result = [];
    for (const a of root.querySelectorAll(selector)) {
      let href;
      try { href = new URL(a.getAttribute('href'), location.href); } catch (_) { continue; }
      if (href.origin !== location.origin) continue;
      const match = withCount ? a.textContent.trim().match(/^(.*?)(?:\s*[（(](\d+)[）)])?$/u) : [null, a.textContent.trim()];
      if (match && match[1]) result.push({name:match[1].trim(), href:href.href, count:match[2] || ''});
    }
    return result;
  }
  // One document request per catalog per page; short-lived session cache on later pages.
  const pending = new Map();
  function catalog(path, selector) {
    if (!pending.has(path)) pending.set(path, (async () => {
      const cacheKey = 'ctp:catalog:' + home + path;
      try {
        const cached = JSON.parse(sessionStorage.getItem(cacheKey));
        if (Date.now() - cached.at < 3600000 && Array.isArray(cached.items)) return cached.items;
      } catch (_) {}
      try {
        const response = await fetch(home + path);
        if (!response.ok) return [];
        const parsed = document.createElement('template'); parsed.innerHTML = await response.text();
        const items = parse(parsed.content, selector);
        if (items.length) try { sessionStorage.setItem(cacheKey, JSON.stringify({at:Date.now(), items})); } catch (_) {}
        return items;
      } catch (_) { return []; }
    })());
    return pending.get(path);
  }
  window.CTP.taxonomy = { parse, categories:() => catalog('categories', categories),
    tags:() => catalog('tag/', '#MyTag1_dtTagList td[data-use-count] a[href]'),
    sidebarTags:() => parse(document, '#sidebar_toptags li a[href]:has(.tag-count)'),
    sidebarCategories:() => parse(document, '#sidebar_postcategory li a[href]') };
})();
