(() => {
  'use strict';
  let mounted = false, tocButton;
  window.CTP.onPage(({ article, config, home }) => {
    const bar = document.querySelector('.ctp-nav');
    if (!bar) return;
    if (!mounted) {
      mounted = true;
      bar.querySelector('.ctp-theme').addEventListener('click', window.CTP.toggleTheme);
      const menuButton = bar.querySelector('.ctp-menu');
      tocButton = document.createElement('button');
      tocButton.className = 'ctp-mobile-toc'; tocButton.textContent = '目录'; tocButton.type = 'button';
      tocButton.setAttribute('aria-haspopup','dialog');
      document.body.append(tocButton);
      const dialog = document.createElement('dialog'); dialog.className = 'ctp-drawer';
      const head = document.createElement('div'); head.className = 'ctp-drawer-head';
      const label = document.createElement('strong'); label.id = 'ctp-drawer-label';
      dialog.setAttribute('aria-labelledby',label.id);
      const close = document.createElement('button'); close.type = 'button'; close.textContent = '关闭';
      head.append(label, close);
      const panel = document.createElement('div'); panel.className = 'ctp-drawer-panel';
      dialog.append(head, panel); document.body.append(dialog);
      let restore;
      function show(isToc) {
        if (dialog.open) return;
        // Native close events run on a later task: the other opener can win that race.
        restore?.(); restore = null;
        const source = isToc ? document.querySelector('.ctp-rail .ctp-toc') : bar.querySelector('.ctp-nav-links');
        if (!source) return;
        const parent = source.parentNode, sibling = source.nextSibling;
        restore = () => parent.insertBefore(source,sibling);
        label.textContent = isToc ? '文章目录' : '站点导航';
        dialog.dataset.edge = isToc ? 'bottom' : 'right';
        panel.replaceChildren(source);
        dialog.showModal();
        close.focus();
      }
      menuButton.addEventListener('click', () => show(false));
      tocButton.addEventListener('click', () => show(true));
      close.addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => { if (!dialog.open) { restore?.(); restore = null; } });
      dialog.addEventListener('click', e => { if (e.target === dialog) {
        const r = dialog.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
      }});
      matchMedia('(width < 960px)').addEventListener('change', () => { if (dialog.open) dialog.close(); });
      // The current calendar month may be empty (Cnblogs returns 404). Prefer the
      // latest published native month once the asynchronous sidebar fills in.
      const archives = [...bar.querySelectorAll('[data-month-template]')];
      if (archives.length) {
        const resolveMonth = () => {
          const published = window.CTP.archive.months()[0];
          if (!published) return;
          for (const a of archives) {
            const raw = a.dataset.monthTemplate.replace('{ym}',published.key.replace('-','/'));
            let url;
            try { url = new URL(raw.startsWith('/') && !raw.startsWith('//') ? home + raw.slice(1) : raw, location.origin + home); }
            catch (_) { continue; }
            if (!['https:', 'http:'].includes(url.protocol)) continue;
            a.href = url.origin === location.origin ? url.pathname + url.search + url.hash : url.href;
            a.removeAttribute('aria-disabled');
            if (window.CTP.archive.month(location.href)) a.setAttribute('aria-current','page');
          }
          observer.disconnect();
        };
        const observer = new MutationObserver(resolveMonth);
        observer.observe(document.querySelector('#sideBar') || document.documentElement, {childList:true, subtree:true});
        resolveMonth();
      }
    }
    tocButton.hidden = !article;
  });
})();
