/* ctp-docs v1.1.0 */
(() => {
  'use strict';
  const api = window.CTP;
  if (!api) return;
  const defaults = { notice:{html:''}, categories:{show:true, include:[], max:8}, code:{collapseLines:34}, copyright:{show:true, license:'CC BY-NC-SA 4.0'}, resume:{show:true} };
  for (const [key, values] of Object.entries(defaults)) api.config[key] = {...values, ...api.config[key]};
  const hooks = [];
  const root = document.documentElement;
  const sideBudget = 30, archiveBudget = 60;
  let frames = 0, current, styled = false;
  api.stylesInstalled.then(() => { styled = true; });
  function run(fn) {
    try { fn(current); } catch (err) { console.error('ctp-docs page component:', err); }
  }
  api.onPage = fn => { hooks.push(fn); if (current) run(fn); };
  function refresh() {
    const main = document.querySelector('#main');
    const content = main?.querySelector('#mainContent');
    if (!content) return;
    const article = content.querySelector('#cnblogs_post_body');
    const kind = article ? 'post' : content.querySelector('.day .postTitle a[href]') ? 'days' :
      content.querySelector('.category-link-list, #MyTag1_dtTagList') ? 'directory' :
      content.querySelector('.category-crumb-item, #myposts') ? 'results' :
      content.querySelector('.entrylist') ? 'archive' : null;
    // Normally mount with both native containers in place. A missing widget or
    // an unsupported page must not leave the static navigation inert forever.
    const released = root.classList.contains('ctp-ready');
    if ((!kind || !main.querySelector('#leftcontentcontainer')) && frames < sideBudget && !released) return;
    if (current?.content !== content || current.article !== article || current.kind !== kind) {
      let rail = main.querySelector(':scope > .ctp-rail');
      if (!rail) {
        rail = document.createElement('aside');
        rail.className = 'ctp-rail';
        rail.innerHTML = '<div class="ctp-rail-body"></div><div class="ctp-rail-foot"></div>';
        main.prepend(rail);
      }
      current = { kind, pending:[], main, content, article, rail, railBody:rail.firstElementChild, railFoot:rail.lastElementChild, home:api.home, config:api.config };
      hooks.forEach(run);
    }
  }
  function settle() {
    frames++;
    if (!current || frames === sideBudget) refresh();
    if (root.classList.contains('ctp-ready')) return;
    if (current && styled) {
      const {kind, article, content, main, pending} = current;
      const sidebar = main.querySelector('#leftcontentcontainer #blog-sidecolumn :is(#sidebar_postcategory,#sidebar_postarchive,#sidebar_toptags) li a[href]');
      const pageReady = {post:article?.textContent.trim(), days:content.querySelector('.ctp-post-row'),
        directory:content.querySelector('.category-list-item a, td[data-use-count] a'),
        results:content.querySelector('.entrylistItemTitle, .postTitl2 a'), archive:content.querySelector('.ctp-month .entrylistItem')}[kind];
      if ((sidebar || frames >= sideBudget) && (!pending.some(wait => !wait()) || frames >= sideBudget) &&
          (pageReady || frames >= (kind === 'archive' ? archiveBudget : sideBudget))) {
        root.classList.add('ctp-ready'); return;
      }
    }
    requestAnimationFrame(settle);
  }
  new MutationObserver(refresh).observe(root, {childList:true, subtree:true, attributes:true, attributeFilter:['id']});
  refresh(); requestAnimationFrame(settle);
})();
