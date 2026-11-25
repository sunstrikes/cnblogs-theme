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
  function publishedIn(root) {
    const evidence = root.querySelector('#mainContent .dayTitle a[href]');
    if (evidence) {
      let day;
      try { day = new URL(evidence.getAttribute('href'), location.href); } catch (_) {}
      if (day && /\/\d{1,2}\/?$/.test(day.pathname)) {
        const result = month(day.origin + day.pathname.replace(/\/\d{1,2}\/?$/, ''));
        if (result) return result;
      }
    }
    // Split home rows still own their original .postDesc publication date.
    const date = root.querySelector('#post-date, #mainContent .day .postDesc')?.textContent
      .match(/(?:^\s*|posted\s*@\s*)(\d{4})-(\d{2})-\d{2}\b/);
    return date && month(home + `p/archive/${date[1]}/${date[2]}`);
  }
  function watchPublished(notify) {
    const cacheKey = 'ctp:archive-month:' + home;
    let cached, previous;
    try {
      const saved = JSON.parse(sessionStorage.getItem(cacheKey));
      if (Date.now() - saved.at < 3600000) cached = month(saved.href);
    } catch (_) {}
    function choose() {
      const listed = months()[0];
      if (listed) observer.disconnect();
      const item = listed || month(location.href) || publishedIn(document) || cached;
      if (!item || previous === item.key) return;
      previous = item.key;
      try { sessionStorage.setItem(cacheKey, JSON.stringify({href:item.href, at:Date.now()})); } catch (_) {}
      notify(item);
    }
    async function fromHome() {
      if (previous || location.pathname === home) return;
      try {
        const response = await fetch(home, {mode:'same-origin'});
        if (!response.ok || new URL(response.url).origin !== location.origin) return;
        const parsed = document.createElement('template'); parsed.innerHTML = await response.text();
        cached = publishedIn(parsed.content); choose();
      } catch (_) { /* Keep the explicit home fallback. */ }
    }
    const observer = new MutationObserver(choose);
    observer.observe(document.querySelector('#main'), {subtree:true, childList:true, characterData:true});
    choose();
    if (!previous) setTimeout(fromHome, 500);
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
  // Own scheduling independently of the mounted month sections. A repeated
  // request can promote a queued month without issuing another fetch.
  function monthQueue() {
    const waiting = [], jobs = new Map(), active = new Set();
    function drain() {
      while (active.size < 3 && waiting.length) {
        const job = waiting.shift(), controller = new AbortController();
        active.add(controller); job.started();
        const timer = setTimeout(() => controller.abort(), 10000);
        entries(job.href, controller.signal).then(job.resolve, job.reject).finally(() => {
          clearTimeout(timer); jobs.delete(job.href); active.delete(controller); drain();
        });
      }
    }
    return {
      request(href, priority, started) {
        let job = jobs.get(href);
        if (!job) {
          job = {href, started};
          job.promise = new Promise((resolve,reject) => Object.assign(job, {resolve,reject}));
          jobs.set(href,job); waiting.push(job);
        }
        const i = waiting.indexOf(job);
        if (priority && i > 0) { waiting.splice(i,1); waiting.unshift(job); }
        drain(); return job.promise;
      },
      dispose() {
        for (const job of waiting.splice(0)) { jobs.delete(job.href); job.reject(new Error('Archive closed')); }
        for (const controller of active) controller.abort();
      }
    };
  }
  window.CTP.archive = {month, months, watchPublished, monthQueue};
})();
