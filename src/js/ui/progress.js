(() => {
  'use strict';
  let dispose = () => {};
  window.CTP.onPage(({article, railFoot}) => {
    dispose(); dispose = () => {};
    if (!article) return;
    function topButton(className) {
      const b = document.createElement('button'); b.className = className; b.type = 'button';
      b.textContent = '↑ 回到顶部'; b.setAttribute('aria-label', '回到顶部');
      b.addEventListener('click', () => window.scrollTo({top:0, behavior:'instant'})); return b;
    }
    const panel = document.createElement('div'); panel.className = 'ctp-progress';
    const desktop = topButton('ctp-top'), mobile = topButton('ctp-mobile-top'); document.body.append(mobile);
    const number = document.createElement('span');
    const bar = document.createElement('progress'); bar.max = 100; bar.setAttribute('aria-label','文章阅读进度');
    panel.append(desktop, number, bar); railFoot.append(panel);
    let frame = 0;
    function paint() {
      frame = 0;
      const end = article.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const value = window.scrollY <= 0 ? 0 : Math.min(100, Math.round(100 * window.scrollY / Math.max(1,end)));
      if (!bar.hasAttribute('value') || value !== bar.value) { bar.value = value; number.textContent = value + '%'; }
      mobile.hidden = window.scrollY < 200;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
    const observer = new ResizeObserver(schedule); observer.observe(article);
    window.addEventListener('scroll',schedule,{passive:true}); window.addEventListener('resize',schedule); paint();
    dispose = () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll',schedule); window.removeEventListener('resize',schedule);
      panel.remove(); mobile.remove();
    };
  });
})();
