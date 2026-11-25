(() => {
  'use strict';
  let dispose = () => {};
  window.CTP.onPage(({article, config}) => {
    dispose(); dispose = () => {};
    if (!article || config.resume.show === false) return;
    const canonical = document.querySelector('#cb_post_title_url')?.pathname || location.pathname;
    const key = 'ctp-read:' + canonical.replace(/\.html\/?$|\/$/,'');
    let saved = 0, toast, hideTimer, saveTimer, frame;
    try { saved = Number(localStorage.getItem(key)); } catch (_) {}
    function store() {
      clearTimeout(saveTimer);
      try {
        if (window.scrollY >= 160) localStorage.setItem(key, String(Math.round(window.scrollY)));
        else localStorage.removeItem(key);
      } catch (_) {}
    }
    function queueSave() { clearTimeout(saveTimer); saveTimer = setTimeout(store, 220); }
    function whenHidden() { if (document.hidden) store(); }
    function close() { toast?.remove(); clearTimeout(hideTimer); }
    function restore() {
      frame = requestAnimationFrame(() => {
        // An explicit section link always wins over a remembered position.
        if (location.hash || !Number.isFinite(saved) || saved < 160) return;
        window.scrollTo({top:saved, behavior:'instant'});
        if (window.scrollY < 160) return;
        toast = document.createElement('div'); toast.className = 'ctp-resume'; toast.setAttribute('role','status');
        const top = document.createElement('button'); top.type = 'button'; top.textContent = '回到开头';
        const dismiss = document.createElement('button'); dismiss.type = 'button'; dismiss.textContent = '关闭';
        top.addEventListener('click', () => { window.scrollTo({top:0, behavior:'instant'}); store(); close(); });
        dismiss.addEventListener('click', close);
        toast.append('已回到上次阅读的位置', top, dismiss); document.body.append(toast); hideTimer = setTimeout(close,5000);
      });
    }
    if (document.readyState === 'complete') restore(); else window.addEventListener('load',restore,{once:true});
    window.addEventListener('scroll',queueSave,{passive:true}); window.addEventListener('pagehide',store);
    document.addEventListener('visibilitychange',whenHidden);
    dispose = () => {
      window.removeEventListener('load',restore); window.removeEventListener('scroll',queueSave);
      window.removeEventListener('pagehide',store); document.removeEventListener('visibilitychange',whenHidden);
      cancelAnimationFrame(frame); clearTimeout(saveTimer); close();
    };
  });
})();
