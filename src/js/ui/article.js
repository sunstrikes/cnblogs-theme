(() => {
  'use strict';
  const cjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;
  function readingStats(article, title) {
    let meta = title.nextElementSibling;
    if (!meta?.matches('.ctp-post-meta')) {
      meta = document.createElement('div'); meta.className = 'ctp-post-meta'; title.after(meta);
    }
    const stats = document.createElement('div'); stats.className = 'ctp-reading-stats';
    const date = document.querySelector('#post-date')?.textContent.trim().split(/\s+/)[0];
    if (date) {
      const time = document.createElement('time'); time.dateTime = date; time.textContent = date; stats.append(time);
    }
    const count = document.createElement('span'), duration = document.createElement('span');
    stats.append(count, duration); meta.prepend(stats);
    function update() {
      // Count authored text only. Code controls and decorative native line numbers aren't words.
      const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
      let words = 0;
      while (walker.nextNode()) {
        const text = walker.currentNode;
        if (!text.parentElement.closest('script,style,button,.ctp-code-head,.cnb-code-toolbar,.cnb-over-length-code-block-toggler,.line-numbers-rows,.hljs-ln-numbers,[aria-hidden="true"]')) {
          const other = text.data.replace(cjk, () => { words++; return ' '; });
          words += (other.match(/[\p{L}\p{N}]+/gu) || []).length;
        }
      }
      count.textContent = words.toLocaleString('zh-CN') + ' 字';
      duration.textContent = '约 ' + Math.max(1, Math.ceil(words / 400)) + ' 分钟';
    }
    update();
    return {update, dispose:() => stats.remove()};
  }
  function copyright(article, title, options) {
    if (options.show === false) return;
    const block = document.createElement('aside'); block.className = 'ctp-copyright'; block.setAttribute('aria-label','版权说明');
    const author = document.querySelector('#post_detail .postDesc a');
    const original = title?.querySelector('a[href]');
    const credit = document.createElement('div'); credit.textContent = '著作权归' + (author?.textContent.trim() || '原作者') + '所有';
    const license = document.createElement('div'); license.textContent = '许可：' + options.license;
    block.append(credit,license);
    if (original) {
      const link = document.createElement('a'); link.textContent = original.textContent.trim(); link.href = original.href;
      const source = document.createElement('div'); source.append('原文：',link); block.append(source);
    }
    article.after(block); return block;
  }
  let dispose = () => {};
  window.CTP.onPage(({article, content, config}) => {
    dispose(); dispose = () => {};
    if (!article) return;
    const title = content.querySelector('#post_detail .postTitle');
    const stats = title && readingStats(article, title);
    const rights = copyright(article, title, config.copyright);
    function prepare() {
      for (const img of article.querySelectorAll('img:not([loading])')) img.loading = 'lazy';
      for (const table of article.querySelectorAll('table')) {
        if (table.closest('.ctp-table-scroll,pre,code,.cnblogs_code,.syntaxhighlighter')) continue;
        const scroll = document.createElement('div'); scroll.className = 'ctp-table-scroll';
        table.before(scroll); scroll.append(table);
      }
    }
    prepare();
    let frame = 0;
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; prepare(); stats?.update(); });
    });
    observer.observe(article, {childList:true, characterData:true, subtree:true});
    dispose = () => { observer.disconnect(); cancelAnimationFrame(frame); stats?.dispose(); rights?.remove(); };
  });
})();
