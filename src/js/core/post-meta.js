(() => {
  'use strict';
  window.CTP.postMeta = title => {
    if (title.nextElementSibling?.matches('.ctp-post-meta')) return title.nextElementSibling;
    const meta = document.createElement('div'); meta.className = 'ctp-post-meta';
    title.after(meta); return meta;
  };
})();
