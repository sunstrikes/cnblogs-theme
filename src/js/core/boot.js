/* ctp-docs v1.0.0 */
(() => {
  'use strict';
  const api = window.CTP;
  if (!api) return;
  const defaults = { notice:{html:''}, categories:{show:true, include:[], max:8}, code:{collapseLines:34}, copyright:{show:true, license:'CC BY-NC-SA 4.0'}, resume:{show:true} };
  for (const [key, values] of Object.entries(defaults)) api.config[key] = {...values, ...api.config[key]};
  const hooks = [];
  let current;
  function run(fn) {
    try { fn(current); } catch (err) { console.error('ctp-docs page component:', err); }
  }
  api.onPage = fn => { hooks.push(fn); if (current) run(fn); };
  function refresh() {
    const main = document.querySelector('#main');
    const content = main?.querySelector('#mainContent');
    if (!content) return;
    const article = content.querySelector('#cnblogs_post_body');
    if (current?.content !== content || current.article !== article) {
      let rail = main.querySelector(':scope > .ctp-rail');
      if (!rail) {
        rail = document.createElement('aside');
        rail.className = 'ctp-rail';
        rail.innerHTML = '<div class="ctp-rail-body"></div><div class="ctp-rail-foot"></div>';
        main.prepend(rail);
      }
      current = { main, content, article, rail, railBody:rail.firstElementChild, railFoot:rail.lastElementChild, home:api.home, config:api.config };
      hooks.forEach(run);
    }
    if ((article?.firstElementChild || (!content.querySelector('#post_detail') && content.firstElementChild)) &&
        main.querySelector('#leftcontentcontainer #blog-sidecolumn > *')) document.documentElement.classList.add('ctp-ready');
  }
  new MutationObserver(refresh).observe(document.documentElement, { childList:true, subtree:true });
  refresh();
})();
