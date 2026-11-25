(() => {
  'use strict';
  const data = window.CTP.taxonomy;
  function link(item) {
    const a = document.createElement('a'); a.href = item.href; a.textContent = item.name; return a;
  }
  function categoryBar({content, home, config, pending}) {
    const first = content.querySelector('.day, .entrylistTitle:has(.category-crumb-item)');
    const options = config.categories;
    if (!first || !options.show) return;
    const bar = document.createElement('nav'); bar.className = 'ctp-category-bar'; bar.setAttribute('aria-label', '分类筛选');
    let catalog = [], complete = false, previous;
    pending.push(() => complete || data.sidebarCategories().length > 0);
    function update() {
      if (!first.isConnected) return;
      const all = catalog.length ? catalog : data.sidebarCategories();
      const include = Array.isArray(options.include) ? options.include : [];
      const max = Number.isFinite(options.max) ? Math.max(0, options.max) : 8;
      const selected = (include.length ? include.map(name => all.find(c => c.name === name)).filter(Boolean) : all).slice(0, max);
      const signature = JSON.stringify(selected);
      if (signature === previous) return;
      previous = signature;
      if (!selected.length) { bar.remove(); return; }
      const homeLink = link({name:'全部', href:home});
      if (first.matches('.day')) homeLink.setAttribute('aria-current','page');
      bar.replaceChildren(homeLink);
      for (const cat of selected) {
        const a = link(cat);
        if (a.pathname === location.pathname) a.setAttribute('aria-current','page');
        if (cat.count) { const n = document.createElement('small'); n.textContent = cat.count; a.append(' ', n); }
        bar.append(a);
      }
      first.before(bar);
    }
    const observer = new MutationObserver(update);
    observer.observe(document.querySelector('#sideBar') || document.documentElement, {childList:true, subtree:true});
    update(); data.categories().then(items => { complete = true; catalog = items; update(); });
    return () => observer.disconnect();
  }
  function articleTaxonomy({content, pending}) {
    const title = content.querySelector('#post_detail .postTitle');
    if (!title) return;
    const words = (document.querySelector('meta[name="keywords"]')?.content || '').split(/[,，]/).map(s => s.trim()).filter(Boolean);
    let cats = [], tags = [], previous;
    const groups = document.createElement('div'); groups.className = 'ctp-post-taxonomy';
    function update() {
      if (!title.isConnected) return;
      // Live post accessories are definitive. Keywords can also name collections;
      // when the post slots are absent, link only names with known taxonomy URLs.
      const resolve = (selector, directory, fallbackWords=words) => {
        const native = content.querySelector(selector);
        if (native) return data.parse(native, 'a[href]', false);
        return fallbackWords.map(s => directory.find(item => item.name === s)).filter(Boolean);
      };
      const categories = resolve('#BlogPostCategory', [...cats, ...data.sidebarCategories()]);
      const categoryNames = new Set(categories.map(item => item.name));
      const items = [categories, resolve('#EntryTag', [...tags, ...data.sidebarTags()],
        words.filter(name => !categoryNames.has(name)))];
      const signature = JSON.stringify(items);
      if (signature === previous) return;
      previous = signature;
      groups.replaceChildren();
      for (const [i, group] of items.entries()) {
        if (!group.length) continue;
        const nav = document.createElement('nav');
        nav.className = i ? 'ctp-post-tags' : 'ctp-post-categories';
        nav.setAttribute('aria-label', i ? '文章标签' : '文章分类');
        nav.append(...group.map(link)); groups.append(nav);
      }
      if (!groups.childElementCount) { groups.remove(); return; }
      window.CTP.postMeta(title).append(groups);
    }
    const observer = new MutationObserver(records => {
      if (records.some(r => r.target.closest?.('#sideBar, #blog_post_info_block') ||
        [...r.addedNodes].some(n => n.nodeType === 1 && (n.matches('#sideBar, #blog_post_info_block') || n.querySelector('#blog_post_info_block'))))) update();
    });
    observer.observe(document.querySelector('#main'), {childList:true, subtree:true});
    update();
    if (words.length) {
      let catsDone = false, tagsDone = false;
      pending.push(() => (catsDone || content.querySelector('#BlogPostCategory')) && (tagsDone || content.querySelector('#EntryTag')));
      data.categories().then(result => { catsDone = true; cats = result; update(); });
      data.tags().then(result => { tagsDone = true; tags = result; update(); });
    }
    return () => observer.disconnect();
  }
  let stop;
  window.CTP.onPage(page => { stop?.(); stop = page.article ? articleTaxonomy(page) : categoryBar(page); });
})();
