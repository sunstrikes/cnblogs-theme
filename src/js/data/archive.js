(() => {
  'use strict';
  const {home} = window.CTP;
  function month(href) {
    let url;
    try { url = new URL(href, location.href); } catch (_) { return null; }
    if (url.origin !== location.origin || !url.pathname.startsWith(home)) return null;
    const match = /^p\/archive\/(\d{4})\/(0?[1-9]|1[0-2])\/?$/i.exec(url.pathname.slice(home.length));
    if (!match) return null;
    return {key:`${match[1]}-${match[2].padStart(2,'0')}`, label:`${match[1]}年${Number(match[2])}月`, href:url.href};
  }
  function months() {
    const known = new Map();
    for (const a of document.querySelectorAll('#sidebar_postarchive li a[href]')) {
      const item = month(a.href);
      if (item) known.set(item.key, item);
    }
    return Array.from(known.values());
  }
  async function entries(href, signal) {
    const response = await fetch(href, {signal});
    if (!response.ok) throw Error('Archive unavailable');
    const parsed = document.createElement('template'); parsed.innerHTML = await response.text();
    const list = parsed.content.querySelector('#mainContent .entrylist');
    if (!list) throw Error('Archive list missing');
    const posts = [];
    for (const entry of list.querySelectorAll('.entrylistItem')) {
      const title = entry.querySelector('.entrylistItemTitle[href]');
      if (!title) continue;
      const target = new URL(title.getAttribute('href'), href);
      if (target.origin !== location.origin) continue;
      const summary = entry.querySelector('.entrylistPostSummary');
      summary?.querySelectorAll('.c_b_p_desc_readmore').forEach(a => a.remove());
      posts.push({title:title.textContent.trim(), href:target.href, summary:summary?.textContent.trim(),
        meta:entry.querySelector('.entrylistItemPostDesc')?.textContent.trim()});
    }
    return posts;
  }
  window.CTP.archive = {month, months, entries};
})();
