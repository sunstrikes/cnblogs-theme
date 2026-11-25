(() => {
  'use strict';
  function sourceText(code) {
    const rows = code.querySelectorAll('.hljs-ln-code');
    if (rows.length) return Array.from(rows, row => row.textContent).join('\n');
    if (!code.querySelector('.line-numbers-rows,.cnb-code-toolbar,br')) return code.textContent;
    const clone = code.cloneNode(true);
    clone.querySelectorAll('.line-numbers-rows,.cnb-code-toolbar').forEach(e => e.remove());
    clone.querySelectorAll('br').forEach(e => e.replaceWith('\n'));
    return clone.textContent;
  }
  async function copy(source) {
    try { await navigator.clipboard.writeText(source); return true; } catch (_) {}
    const focus = document.activeElement, field = document.createElement('textarea');
    field.value = source; field.readOnly = true; field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field); field.select();
    try { return document.execCommand('copy'); } finally { field.remove(); focus?.focus({preventScroll:true}); }
  }
  function enhance(pre, code, limit) {
    const source = sourceText(code);
    if (!source.trim()) return;
    const shell = document.createElement('div'); shell.className = 'ctp-code';
    const head = document.createElement('div'); head.className = 'ctp-code-head';
    const lang = document.createElement('span');
    const classes = code.className + ' ' + pre.className;
    lang.textContent = /(?:^|\s)(?:language|lang)-([\w+#.-]+)/i.exec(classes)?.[1] || '纯文本';
    const button = document.createElement('button'); button.type = 'button'; button.textContent = '复制';
    button.setAttribute('aria-label','复制代码');
    let timer;
    button.addEventListener('click', async () => {
      let ok;
      try { ok = await copy(source); } catch (_) {}
      button.textContent = ok ? '已复制' : '请手动复制';
      clearTimeout(timer); timer = setTimeout(() => { button.textContent = '复制'; }, 1800);
    });
    head.append(lang, button); pre.before(shell); shell.append(head, pre);
    const lines = source.replace(/\n$/, '').split('\n').length;
    if (lines > limit) {
      const fold = document.createElement('button'); fold.type = 'button'; fold.className = 'ctp-code-fold';
      shell.style.setProperty('--visible-lines', Math.min(limit, 14));
      function render(closed) {
        shell.classList.toggle('ctp-code-folded', closed);
        fold.setAttribute('aria-expanded', String(!closed));
        fold.textContent = closed ? `展开全部 ${lines} 行` : '收起';
      }
      fold.addEventListener('click', () => render(fold.getAttribute('aria-expanded') === 'true'));
      render(true); shell.append(fold);
    }
  }
  let dispose = () => {};
  window.CTP.onPage(({article, config}) => {
    dispose(); dispose = () => {};
    if (!article) return;
    const n = Number(config.code.collapseLines);
    const limit = Number.isFinite(n) && n >= 1 ? Math.floor(n) : 34;
    function scan() {
      for (const code of article.querySelectorAll('pre > code')) {
        if (!code.closest('.cnblogs_code,.syntaxhighlighter,.ctp-code')) enhance(code.parentElement, code, limit);
      }
    }
    const observer = new MutationObserver(scan);
    observer.observe(article,{childList:true, subtree:true}); scan();
    dispose = () => observer.disconnect();
  });
})();
