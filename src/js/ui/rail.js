(() => {
  'use strict';
  let dispose = () => {};
  window.CTP.onPage(({ article, railBody }) => {
    dispose();
    dispose = () => {};
    if (!article) return;
    const title = document.createElement('p');
    title.className = 'ctp-rail-title'; title.textContent = '本文目录';
    const nav = document.createElement('nav');
    nav.className = 'ctp-toc'; nav.setAttribute('aria-label','文章目录');
    const list = document.createElement('ol');
    nav.append(list);
    railBody.replaceChildren(title, nav);
    let headings = [], labels = [], links = [], frame = 0, active = -1, nextId = 1, selected = null;
    function spy() {
      frame = 0;
      if (!headings.length) return;
      let index = 0;
      for (let i = 1; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top > 88) break;
        index = i;
      }
      // At the bottom, a late heading may never reach the top reading line.
      // Keep an explicitly selected visible heading until the reader scrolls on.
      if (selected && Math.abs(window.scrollY - selected.y) <= 2) index = selected.index;
      else {
        selected = null;
        if (window.scrollY > 0 && Math.ceil(window.scrollY + innerHeight) >= document.documentElement.scrollHeight) index = headings.length - 1;
      }
      if (index === active) return;
      links[active]?.removeAttribute('aria-current');
      active = index;
      links[index].setAttribute('aria-current','location');
      const y = links[index].getBoundingClientRect().top, box = railBody.getBoundingClientRect();
      if (box.height && (y < box.top || y > box.bottom - 30)) railBody.scrollTop += y - box.top - box.height / 2;
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(spy); };
    function rebuild() {
      const next = Array.from(article.querySelectorAll('h1,h2,h3,h4')).filter(h => h.getClientRects().length && h.textContent.trim());
      const text = next.map(h => h.textContent.trim());
      if (next.length === headings.length && next.every((h,i) => h === headings[i] && text[i] === labels[i])) return;
      headings = next; labels = text; active = -1; selected = null;
      list.replaceChildren();
      if (!headings.length) nav.closest('dialog')?.close();
      links = headings.map((heading,i) => {
        let id = heading.id || heading.querySelector(':scope > a[id]')?.id;
        if (!id) {
          do { id = 'ctp-section-' + nextId++; } while (document.getElementById(id));
          heading.id = id;
        }
        const li = document.createElement('li');
        li.dataset.level = heading.tagName.slice(1);
        const link = document.createElement('a');
        link.textContent = text[i]; link.href = '#' + encodeURIComponent(id);
        link.addEventListener('click', event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          nav.closest('dialog')?.close();
          history.pushState(null,'',link.hash);
          heading.tabIndex = -1; heading.focus({preventScroll:true});
          heading.scrollIntoView({block:'start', behavior:'instant'});
          selected = {index:i, y:window.scrollY}; schedule();
        });
        li.append(link); list.append(li); return link;
      });
      schedule();
    }
    const observer = new MutationObserver(rebuild);
    observer.observe(article,{childList:true, subtree:true, characterData:true});
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    rebuild();
    dispose = () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll',schedule); window.removeEventListener('resize',schedule);
      nav.remove(); title.remove();
    };
  });
})();
