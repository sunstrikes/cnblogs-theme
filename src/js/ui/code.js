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
  function markPythonMethods(code) {
    if (!/(?:^|\s)(?:lang|language)-(?:py|python)(?:\s|$)/i.test(code.className + ' ' + code.parentElement.className)) return;
    const hljs = code.classList.contains('hljs') || code.classList.contains('highlighter-hljs');
    const role = hljs ? 'hljs-title function_' : 'token function';
    function method(name) {
      const span = document.createElement('span');
      span.className = role; span.textContent = name;
      return span;
    }
    // Prism splits ".softmax(" into three siblings. Never re-tokenize a string or comment.
    if (!hljs) {
      for (const paren of code.querySelectorAll(':scope > .token.punctuation')) {
        if (paren.textContent !== '(') continue;
        const text = paren.previousSibling, dot = text?.previousSibling;
        if (text?.nodeType !== Node.TEXT_NODE || !dot?.matches?.('.token.punctuation') || dot.textContent !== '.') continue;
        const m = /^([ \t]*)([_\p{ID_Start}][_\p{ID_Continue}]*)([ \t]*)$/u.exec(text.data);
        if (m) text.replaceWith(m[1], method(m[2]), m[3]);
      }
      return;
    }
    // Highlight.js leaves dotted calls together in a text node, optionally inside a line-number cell.
    // The platform can assign the engine class before it has tokenized strings/comments.
    if (!code.hasAttribute('data-highlighted') && !code.querySelector('[class*="hljs-"]')) return;
    const rows = code.querySelectorAll('.hljs-ln-code');
    for (const row of rows.length ? rows : [code]) {
      for (const text of Array.from(row.childNodes)) {
        if (text.nodeType !== Node.TEXT_NODE) continue;
        let pos = 0;
        const parts = [];
        for (const m of text.data.matchAll(/(\.[ \t]*)([_\p{ID_Start}][_\p{ID_Continue}]*)(?=[ \t]*\()/gu)) {
          parts.push(text.data.slice(pos, m.index + m[1].length), method(m[2]));
          pos = m.index + m[0].length;
        }
        if (parts.length) text.replaceWith(...parts, text.data.slice(pos));
      }
    }
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
    function update(code) {
      if (!article.contains(code) || code.closest('.cnblogs_code,.syntaxhighlighter')) return;
      if (!code.closest('.ctp-code')) enhance(code.parentElement, code, limit);
      markPythonMethods(code);
    }
    const observer = new MutationObserver(changes => {
      const codes = new Set();
      for (const {target, addedNodes} of changes) {
        const owner = target.closest('pre > code');
        if (owner) { codes.add(owner); continue; }
        for (const node of addedNodes) {
          if (node.matches?.('pre > code')) codes.add(node);
          node.querySelectorAll?.('pre > code').forEach(code => codes.add(code));
        }
      }
      codes.forEach(update);
    });
    observer.observe(article,{childList:true, subtree:true});
    article.querySelectorAll('pre > code').forEach(update);
    dispose = () => observer.disconnect();
  });
})();
