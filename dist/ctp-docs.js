// Either resource can finish first; only inject after both stylesheets failed.
window.CTP.stylesLoaded.then(loaded => {
  if (loaded) return;
  const style = document.createElement('style');
  style.textContent = "@view-transition{navigation: auto;}:root{--ctp-field:2;--ctp-first-canvas:#eff1f5;--ctp-first-chrome:#dce0e8;--ctp-first-ink:#4c4f69;--ctp-first-line:#ccd0da;color-scheme:light;}:root[data-theme=\"mocha\"]{--ctp-first-canvas:#1e1e2e;--ctp-first-chrome:#11111b;--ctp-first-ink:#cdd6f4;--ctp-first-line:#313244;color-scheme:dark;}html,body{background:var(--ctp-first-canvas);color:var(--ctp-first-ink);margin:0;}html:not(.ctp-ready) #home{opacity:0;animation:ctp-reveal 0s linear 2.5s forwards;}@keyframes ctp-reveal{to{opacity:1;}}#top_nav,#header,#sideBar{display:none !important;}#page_begin_html{display:contents;}.ctp-nav{box-sizing:border-box;height:52px;position:sticky;top:0;z-index:40;color:var(--ctp-first-ink);background:var(--ctp-first-chrome);border-bottom:1px solid var(--ctp-first-line);view-transition-name:ctp-nav;font:14px 'IBM Plex Sans',-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei',sans-serif;}.ctp-nav-inner{height:100%;max-width:1360px;box-sizing:border-box;margin:auto;padding:0 28px;display:flex;align-items:center;gap:20px;}.ctp-nav a{text-decoration:none;color:inherit;}.ctp-brand{min-width:216px;font-size:16px;font-weight:650;letter-spacing:-.02em;}.ctp-nav-links{display:flex;align-items:center;gap:4px;}.ctp-nav-links a{padding:7px 11px;}.ctp-nav button{background:transparent;color:inherit;border:1px solid var(--ctp-first-line);border-radius:6px;padding:5px 12px;font:inherit;cursor:pointer;}.ctp-theme{margin-left:auto;}.ctp-menu{display:none;}::view-transition-old(ctp-nav),::view-transition-new(ctp-nav),::view-transition-group(ctp-nav){animation:none;opacity:1;}::view-transition-old(root){animation:none;}@media (width < 960px){.ctp-nav-inner{padding:0 16px;gap:8px;}.ctp-brand{min-width:0;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}.ctp-nav-links{display:none;}.ctp-menu{display:inline-block;}}@media (prefers-reduced-motion: reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none !important;}}:root,html[data-theme=\"latte\"]{--ctp-base: #eff1f5;--ctp-mantle: #e6e9ef;--ctp-crust: #dce0e8;--ctp-surface0: #ccd0da;--ctp-surface1: #bcc0cc;--ctp-surface2: #acb0be;--ctp-overlay0: #9ca0b0;--ctp-overlay1: #8c8fa1;--ctp-overlay2: #7c7f93;--ctp-subtext0: #6c6f85;--ctp-subtext1: #5c5f77;--ctp-text: #4c4f69;--ctp-rosewater: #dc8a78;--ctp-flamingo: #dd7878;--ctp-mauve: #8839ef;--ctp-blue: #1e66f5;--ctp-teal: #179299;--ctp-lavender: #7287fd;--ctp-green: #40a02b;--ctp-peach: #fe640b;--ctp-yellow: #df8e1d;--ctp-sky: #04a5e5;--ctp-maroon: #e64553;--ctp-red: #d20f39;--ctp-pink: #ea76cb;--ctp-sapphire: #209fb5;--bg-canvas: var(--ctp-base);--bg-rail: var(--ctp-mantle);--bg-code: var(--ctp-mantle);--bg-chrome: var(--ctp-crust);--bg-code-head: var(--ctp-crust);--bg-subtle: var(--ctp-surface0);--bg-subtle-hover: var(--ctp-surface1);--border-subtle: var(--ctp-surface0);--border-strong: var(--ctp-surface1);--border-rail-track: var(--ctp-surface1);--ink-primary: var(--ctp-text);--ink-secondary: var(--ctp-subtext1);--ink-muted: var(--ctp-subtext0);--ink-code-comment: var(--ctp-overlay2);--ink-line-num: var(--ctp-overlay1);--accent: var(--ctp-mauve);--accent-soft: rgba(136,57,239,0.11);--link: var(--ctp-blue);--link-underline: rgba(30,102,245,0.35);--focus-ring: var(--ctp-lavender);--selection-bg: rgba(172,176,190,0.4);--callout-info-bg: rgba(30,102,245,0.08);--callout-tip-bg: rgba(23,146,153,0.08);--callout-warn-bg: rgba(223,142,29,0.1);}html[data-theme=\"mocha\"]{--ctp-base: #1e1e2e;--ctp-mantle: #181825;--ctp-crust: #11111b;--ctp-surface0: #313244;--ctp-surface1: #45475a;--ctp-surface2: #585b70;--ctp-overlay0: #6c7086;--ctp-overlay1: #7f849c;--ctp-overlay2: #9399b2;--ctp-subtext0: #a6adc8;--ctp-subtext1: #bac2de;--ctp-text: #cdd6f4;--ctp-rosewater: #f5e0dc;--ctp-flamingo: #f2cdcd;--ctp-mauve: #cba6f7;--ctp-blue: #89b4fa;--ctp-teal: #94e2d5;--ctp-lavender: #b4befe;--ctp-green: #a6e3a1;--ctp-peach: #fab387;--ctp-yellow: #f9e2af;--ctp-sky: #89dceb;--ctp-maroon: #eba0ac;--ctp-red: #f38ba8;--ctp-pink: #f5c2e7;--ctp-sapphire: #74c7ec;--accent: var(--ctp-mauve);--accent-soft: rgba(203,166,247,0.12);--link: var(--ctp-blue);--link-underline: rgba(137,180,250,0.35);--focus-ring: var(--ctp-lavender);--selection-bg: rgba(88,91,112,0.5);--callout-info-bg: rgba(137,180,250,0.09);--callout-tip-bg: rgba(148,226,213,0.08);--callout-warn-bg: rgba(249,226,175,0.09);}html[data-accent=\"blue\"]{--accent:var(--ctp-blue);}html[data-accent=\"teal\"]{--accent:#126c71;}html[data-accent=\"lavender\"]{--accent:#4f58aa;}html[data-theme=\"mocha\"][data-accent=\"teal\"]{--accent:var(--ctp-teal);}html[data-theme=\"mocha\"][data-accent=\"lavender\"]{--accent:var(--ctp-lavender);}:root{--font-sans:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei',sans-serif;--font-mono:'JetBrains Mono','Maple Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}*,*::before,*::after{box-sizing:border-box;}html,body,#home{color:var(--ink-primary);background:var(--bg-canvas);}body{margin:0 !important;padding:0 !important;font:16px/1.76 var(--font-sans);}button{font:inherit;}a{color:var(--link);}::selection{background:var(--selection-bg);}:focus-visible{outline:2px solid var(--focus-ring);outline-offset:3px;}#home{width:100%;max-width:none;margin:0;padding:0;}#main{display:grid;grid-template-columns:264px minmax(0,1fr);align-items:start;max-width:1360px;min-height:calc(100vh - 52px);margin:0 auto;padding:0;}#main > .clear{display:none;}#mainContent{grid-column:1 / -1;min-width:0;width:auto;margin:0;padding:44px clamp(24px,4.4vw,64px) 96px;float:none;}.ctp-rail ~ #mainContent{grid-column:2;}#mainContent > .forFlow{max-width:880px;margin:0 auto;min-width:0;}#mainContent:has(#post_detail) > .forFlow{max-width:840px;}.ctp-rail{grid-column:1;position:sticky;top:52px;display:flex;flex-direction:column;height:calc(100vh - 52px);padding:26px 18px 18px 22px;background:var(--bg-rail);border-inline:1px solid var(--border-subtle);}.ctp-rail-body{flex:1;min-height:0;overflow-y:auto;scrollbar-width:thin;}.ctp-rail-title{margin:0 0 15px;font-size:13px;font-weight:650;color:var(--ink-muted);}.ctp-toc ol{list-style:none;margin:0 0 0 2px;padding:0;border-inline-start:1px solid var(--border-rail-track);}.ctp-toc a{display:block;position:relative;padding:5px 7px 5px 14px;color:var(--ink-secondary);font-size:13.5px;line-height:1.5;text-decoration:none;overflow-wrap:anywhere;}.ctp-toc [data-level=\"3\"] a{padding-inline-start:25px;}.ctp-toc [data-level=\"4\"] a{padding-inline-start:36px;}.ctp-toc a:hover{color:var(--ink-primary);}.ctp-toc a[aria-current=\"location\"]{color:var(--accent);font-weight:650;}.ctp-toc a[aria-current=\"location\"]::before{content:'';width:3px;position:absolute;inset:4px auto 4px -2px;background:var(--accent);border-radius:2px;}#cnblogs_post_body :is(h1,h2,h3,h4),#cnblogs_post_body :is(h1,h2,h3,h4) a[id]{scroll-margin-top:76px;}.ctp-nav-links a:hover,.ctp-nav button:hover{background:var(--bg-subtle);border-radius:5px;}.ctp-nav-links a[aria-current]{color:var(--accent);font-weight:600;}#footer{padding:20px;border-top:1px solid var(--border-subtle);color:var(--ink-muted);font-size:12px;text-align:center;}@media (width < 960px){#main{display:flex;flex-direction:column;align-items:stretch;max-width:100%;}.ctp-rail{display:none;}#mainContent{padding:28px 20px 88px;max-width:100%;}}.ctp-mobile-toc{display:none;}.ctp-drawer{padding:0;color:var(--ink-primary);background:var(--bg-rail);border:1px solid var(--border-subtle);}.ctp-drawer::backdrop{background:rgb(17 17 27 / 38%);}.ctp-drawer[open]{display:flex;flex-direction:column;}.ctp-drawer[data-edge=\"right\"]{inset:0 0 0 auto;margin:0;max-height:none;height:100dvh;max-width:85vw;width:320px;animation:ctp-slide-in .15s ease-out;}.ctp-drawer[data-edge=\"bottom\"]{inset:auto 0 0;margin:0;max-height:70dvh;max-width:none;width:100%;border-radius:14px 14px 0 0;animation:ctp-rise-in .15s ease-out;}.ctp-drawer-head{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border-subtle);}.ctp-drawer button,.ctp-mobile-toc{padding:6px 12px;background:var(--bg-rail);border:1px solid var(--border-strong);color:var(--ink-primary);border-radius:6px;cursor:pointer;}.ctp-drawer-panel{padding:12px 22px max(22px,env(safe-area-inset-bottom));overflow:auto;}.ctp-drawer .ctp-nav-links{display:flex;flex-direction:column;align-items:stretch;}.ctp-drawer .ctp-nav-links a{color:var(--ink-primary);text-decoration:none;}@keyframes ctp-slide-in{from{transform:translateX(100%);}}@keyframes ctp-rise-in{from{transform:translateY(100%);}}@media (width < 960px){.ctp-mobile-toc:not([hidden]){display:inline-block;position:fixed;z-index:32;left:16px;bottom:max(16px,env(safe-area-inset-bottom));font-size:14px;}}@media (prefers-reduced-motion: reduce){.ctp-drawer[open]{animation:none;}}#post_detail .postTitle{margin:0 0 12px;padding:0;border:0;font:650 31px/1.3 var(--font-sans);letter-spacing:-.025em;overflow-wrap:anywhere;}#post_detail .postTitle a{color:var(--ink-primary);text-decoration:none;}.ctp-post-meta,.ctp-reading-stats{display:flex;flex-wrap:wrap;align-items:baseline;gap:.25em 1.2em;}.ctp-post-meta{margin-bottom:32px;color:var(--ink-muted);font:13px/1.65 var(--font-sans);}#cnblogs_post_body{margin:0;color:var(--ink-primary);font:16px/1.76 var(--font-sans);overflow-wrap:anywhere;}#cnblogs_post_body :is(h1,h2,h3,h4,h5,h6){color:var(--ink-primary);font-family:var(--font-sans);font-weight:650;line-height:1.35;border:0;padding:0;}#cnblogs_post_body h1{margin:1.85em 0 .65em;font-size:25px;}#cnblogs_post_body h2{margin:2.25em 0 .7em;font-size:22px;}#cnblogs_post_body h3{margin:1.8em 0 .6em;font-size:18px;}#cnblogs_post_body p{margin:.8em 0;font-size:inherit;line-height:inherit;}#cnblogs_post_body a,.ctp-copyright a,#post_next_prev a{color:var(--link);text-decoration:underline;text-decoration-color:var(--link-underline);text-underline-offset:.2em;}#cnblogs_post_body a:hover,.ctp-copyright a:hover{text-decoration-color:currentColor;}#cnblogs_post_body :not(pre) > code{color:var(--ink-primary);background:var(--bg-subtle);border:0;border-radius:3px;padding:.08em .28em;font:.9em var(--font-mono);}#cnblogs_post_body :is(blockquote,.ctp-callout-success,.ctp-callout-info,.ctp-callout-tip,.ctp-callout-warning,.ctp-callout-danger,.markdown-alert){padding:.7em 1.15em;margin:1.35em 0;color:var(--ink-primary);border:0;border-inline-start:3px solid var(--callout-stripe,var(--accent));background:var(--bg-rail);}#cnblogs_post_body :is(.ctp-callout-success,.markdown-alert-success){--callout-stripe:var(--ctp-green);}#cnblogs_post_body :is(.ctp-callout-info,.markdown-alert-note){--callout-stripe:var(--ctp-blue);}#cnblogs_post_body :is(.ctp-callout-tip,.markdown-alert-tip){--callout-stripe:var(--ctp-teal);}#cnblogs_post_body :is(.ctp-callout-warning,.markdown-alert-warning){--callout-stripe:var(--ctp-yellow);}#cnblogs_post_body :is(.ctp-callout-danger,.markdown-alert-caution){--callout-stripe:var(--ctp-red);}#cnblogs_post_body :is(mjx-container,.MathJax,.MathJax_Display,.katex,.katex-display){color:var(--ink-primary);max-width:100%;}#cnblogs_post_body :is(mjx-container[display=\"true\"],.MathJax_Display,.katex-display){overflow-x:auto;}@media (width < 960px){#post_detail .postTitle{font-size:25px;}}#cnblogs_post_body img{max-width:100% !important;height:auto;}#cnblogs_post_body pre,#cnblogs_post_body .cnblogs_code,.ctp-table-scroll{max-width:100%;overflow-x:auto;}#cnblogs_post_body pre{white-space:pre;overflow-wrap:normal;}.ctp-table-scroll{margin:1.25em 0;}#cnblogs_post_body .ctp-table-scroll > table{width:max-content;min-width:100%;border-collapse:collapse;margin:0;}#cnblogs_post_body .ctp-table-scroll :is(th,td){padding:.45em .8em;text-align:start;border:1px solid var(--border-subtle);}#cnblogs_post_body .ctp-table-scroll th{background:var(--bg-rail);font-weight:600;}#cnblogs_post_body .ctp-table-scroll td{background:var(--bg-canvas);}#cnblogs_post_body .ctp-code{position:relative;max-width:100%;margin:1.4em 0;border:1px solid var(--border-subtle);border-radius:6px;background:var(--bg-code);}.ctp-code-head{display:flex;align-items:center;justify-content:space-between;height:36px;padding:0 14px;color:var(--ink-secondary);font:12px/1.4 var(--font-mono);background:var(--bg-code-head);border-radius:5px 5px 0 0;}.ctp-code button{color:var(--ink-secondary);font:13px var(--font-sans);background:transparent;border:0;cursor:pointer;}.ctp-code-head button{padding:5px 8px;}.ctp-code button:hover{color:var(--ink-primary);}#cnblogs_post_body .ctp-code pre,#cnblogs_post_body .ctp-code pre > code{border:0;border-radius:0;box-shadow:none;margin:0;color:var(--ink-primary);background:var(--bg-code);text-shadow:none;font:14px/1.65 var(--font-mono);white-space:pre;word-break:normal;overflow-wrap:normal;}#cnblogs_post_body .ctp-code pre{padding:14px 16px;overflow:auto;max-height:none;animation:none;transition:none;}#cnblogs_post_body .ctp-code pre > code{display:block;padding:0;overflow:visible;}#cnblogs_post_body .ctp-code :is(.cnb-code-toolbar,.cnb-over-length-code-block-toggler){display:none;}#cnblogs_post_body .ctp-code .line-numbers{padding-inline-start:3.8em;}#cnblogs_post_body .ctp-code .line-numbers-rows > span::before,#cnblogs_post_body .ctp-code .hljs-ln-numbers{color:var(--ink-line-num);}#cnblogs_post_body .ctp-code :is(.hljs-keyword,.hljs-selector-tag,.hljs-doctag,.token.keyword,.token.atrule){color:var(--ctp-mauve);}#cnblogs_post_body .ctp-code :is(.hljs-title,.hljs-section,.token.function,.token.function-variable){color:var(--ctp-blue);}#cnblogs_post_body .ctp-code :is(.hljs-string,.hljs-addition,.token.string,.token.char,.token.attr-value,.token.inserted){color:var(--ctp-green);}#cnblogs_post_body .ctp-code :is(.hljs-number,.hljs-literal,.hljs-symbol,.token.number,.token.constant,.token.boolean,.token.symbol){color:var(--ctp-peach);}#cnblogs_post_body .ctp-code :is(.hljs-type,.hljs-title.class_,.token.class-name,.token.selector){color:var(--ctp-yellow);}#cnblogs_post_body .ctp-code :is(.hljs-operator,.token.operator,.token.entity){color:var(--ctp-sky);}#cnblogs_post_body .ctp-code :is(.hljs-params,.hljs-variable,.token.parameter,.token.variable){color:var(--ctp-maroon);}#cnblogs_post_body .ctp-code :is(.hljs-built_in,.hljs-meta,.hljs-deletion,.token.builtin,.token.macro,.token.tag,.token.deleted){color:var(--ctp-red);}#cnblogs_post_body .ctp-code :is(.hljs-regexp,.hljs-char.escape_,.token.regex,.token.escape){color:var(--ctp-pink);}#cnblogs_post_body .ctp-code :is(.hljs-attr,.hljs-attribute,.token.property,.token.attr-name){color:var(--ctp-teal);}#cnblogs_post_body .ctp-code :is(.hljs-comment,.hljs-quote,.token.comment,.token.prolog,.token.doctype,.token.cdata){color:var(--ink-code-comment);}#cnblogs_post_body .ctp-code :is(.hljs-punctuation,.token.punctuation){color:var(--ink-secondary);}#cnblogs_post_body .ctp-code-folded pre{max-height:calc(28px + var(--visible-lines) * 1.65em);overflow-y:hidden;}.ctp-code-fold{position:relative;display:block;width:100%;padding:7px 12px;border-top:1px solid var(--border-subtle);}.ctp-code-folded .ctp-code-fold::before{content:'';position:absolute;inset:-22px 0 100%;background:linear-gradient(transparent,var(--bg-code));pointer-events:none;}.ctp-copyright{margin:36px 0 24px;padding:12px 18px;border-inline-start:2px solid var(--border-strong);background:var(--bg-rail);color:var(--ink-secondary);font:14px/1.75 var(--font-sans);overflow-wrap:anywhere;}#post_next_prev:not(:empty){padding:18px 0;border-block:1px solid var(--border-subtle);color:var(--ink-secondary);}#blog-comments-placeholder,#comment_form{color:var(--ink-primary);overflow-wrap:anywhere;}#blog-comments-placeholder .feedbackItem,#comment_form .login_tips{padding:13px 16px;background:var(--bg-rail);border-bottom:1px solid var(--border-subtle);color:var(--ink-primary);}#blog-comments-placeholder :is(.feedbackListSubtitle,.comment_vote){color:var(--ink-secondary);font-size:13px;}#blog-comments-placeholder a,#comment_form a{color:var(--link);text-decoration:underline;}#comment_form :is(.comment_textarea,textarea,input:not([type]),input[type=\"text\"],select){max-width:100%;background:var(--bg-rail);border:1px solid var(--border-strong);color:var(--ink-primary);font:inherit;}#comment_form textarea{width:100%;min-height:7em;padding:8px;resize:vertical;}#comment_form :is(.commentbox_title,.commentbox_footer){border-color:var(--border-subtle);}#comment_form :is(.commentbox_tab,.commentbox_tab.active){color:var(--ink-secondary);}#comment_form :is(button,input[type=\"submit\"],#btn_comment_submit){padding:6px 12px;border:1px solid var(--border-strong);border-radius:4px;background:var(--bg-rail);color:var(--ink-primary);cursor:pointer;}.ctp-progress{display:grid;grid-template-columns:1fr auto;align-items:center;gap:6px;padding-top:16px;color:var(--ink-secondary);font:12px var(--font-mono);}.ctp-top{justify-self:start;padding:4px 0;border:0;background:transparent;color:var(--ink-secondary);font:13px var(--font-sans);cursor:pointer;}.ctp-top:hover{color:var(--accent);}.ctp-progress progress{grid-column:1/-1;width:100%;height:3px;appearance:none;border:0;color:var(--accent);background:var(--border-rail-track);}.ctp-progress progress::-webkit-progress-bar{background:var(--border-rail-track);}.ctp-progress progress::-webkit-progress-value{background:var(--accent);}.ctp-progress progress::-moz-progress-bar{background:var(--accent);}.ctp-mobile-top{display:none;}@media (width < 960px){.ctp-mobile-top:not([hidden]){display:block;position:fixed;z-index:32;right:16px;bottom:max(16px,env(safe-area-inset-bottom));padding:6px 12px;background:var(--bg-rail);border:1px solid var(--border-strong);border-radius:6px;color:var(--ink-primary);font-size:14px;cursor:pointer;}}.ctp-resume{position:fixed;z-index:35;inset:auto auto 20px 50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;width:max-content;max-width:calc(100% - 28px);padding:8px 14px;border:1px solid var(--border-strong);border-radius:6px;color:var(--ink-primary);background:var(--bg-rail);font:13px/1.5 var(--font-sans);}.ctp-resume button{padding:4px 1px;color:var(--link);background:transparent;border:0;text-decoration:underline;cursor:pointer;}@media (width < 960px){.ctp-resume{bottom:calc(max(16px,env(safe-area-inset-bottom)) + 48px);}}@media print{:root,:root[data-theme]{color-scheme:light;--bg-canvas:white;--bg-code:white;--bg-rail:white;--bg-subtle:white;--ink-primary:#111;--ink-secondary:#333;--ink-muted:#444;--link:#111;--link-underline:#555;--border-subtle:#ccc;--border-strong:#aaa;}html,body,#home,#mainContent{background:white !important;color:#111 !important;}#home{opacity:1 !important;}.ctp-nav,.ctp-rail,.ctp-drawer[open],.ctp-drawer::backdrop,.ctp-mobile-top,.ctp-mobile-toc,.ctp-resume,.ctp-code-head,.ctp-code-fold,#comment_form,#blog-comments-placeholder,#blog_post_info_block,#footer{display:none !important;}#main{display:block;min-height:0;max-width:none;}#mainContent,#mainContent > .forFlow{max-width:none !important;margin:0;padding:0;}#cnblogs_post_body{color:#111;font-size:11pt;}#cnblogs_post_body :is(h1,h2,h3,h4){break-after:avoid;}#cnblogs_post_body p{orphans:3;widows:3;}#cnblogs_post_body pre,#cnblogs_post_body .ctp-code pre > code,#cnblogs_post_body .ctp-code pre *{color:#111 !important;white-space:pre-wrap;overflow-wrap:anywhere;}#cnblogs_post_body .ctp-code pre,.ctp-table-scroll{max-height:none !important;overflow:visible;}#cnblogs_post_body .ctp-table-scroll > table{width:100%;}}.ctp-post-row,.entrylistItem,#myposts .PostList{padding:24px 0;border-bottom:1px solid var(--border-subtle);scroll-margin-top:72px;}:is(.ctp-post-row .postTitle,.entrylistPosttitle,.postTitl2) a{color:var(--ink-primary);font-size:20px;font-weight:650;line-height:1.38;letter-spacing:-.01em;text-decoration:none;}:is(.ctp-post-row .postTitle,.entrylistPosttitle,.postTitl2) a:hover{color:var(--accent);}.ctp-post-row .postCon,.entrylistPostSummary{margin:8px 0 12px;font-size:14.5px;color:var(--ink-secondary);line-height:1.68;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}:is(.ctp-post-row,.entrylistItem) .c_b_p_desc_readmore{display:none;}.ctp-post-row .postDesc,.entrylistItemPostDesc,.postDesc2{font-size:13px;color:var(--ink-muted);}.ctp-post-row .postDesc span,.entrylistItemPostDesc span,.postDesc2 span{display:inline-block;margin-inline-start:.6em;}.topicListFooter{padding:18px 0;}.ctp-page-index{margin-left:2px;border-left:1px solid var(--border-rail-track);}.ctp-page-index a{display:block;padding:5px 7px 5px 14px;color:var(--ink-secondary);font-size:13.5px;line-height:1.5;text-decoration:none;overflow-wrap:anywhere;}.ctp-page-index a:hover{color:var(--accent);}.ctp-notice{padding-bottom:18px;margin-bottom:22px;border-bottom:1px solid var(--border-subtle);font-size:13.5px;line-height:1.65;color:var(--ink-secondary);overflow-wrap:anywhere;}.ctp-notice h2{margin:0 0 6px;color:var(--ink-primary);font-size:14.5px;font-weight:650;}.ctp-notice p{margin:0;}.ctp-category-bar{display:flex;flex-wrap:wrap;gap:8px;padding-bottom:20px;margin-bottom:8px;border-bottom:1px solid var(--border-subtle);}.ctp-category-bar a{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:6px;color:var(--ink-secondary);background:var(--bg-subtle);font-size:13.5px;text-decoration:none;}.ctp-category-bar a:hover{background:var(--bg-subtle-hover);}.ctp-category-bar a[aria-current]{color:var(--accent);font-weight:600;background:var(--accent-soft);}.ctp-category-bar small{font-size:12px;}.ctp-post-taxonomy,.ctp-post-taxonomy nav{display:inline-flex;align-items:center;flex-wrap:wrap;gap:7px;}.ctp-post-taxonomy{gap:14px;font-size:13px;}.ctp-post-categories a{color:var(--ink-secondary);text-underline-offset:.18em;}.ctp-post-tags a{padding:2px 9px;border-radius:5px;background:var(--bg-subtle);color:var(--ink-secondary);text-decoration:none;}.category-block-title,#taglist_title,.entrylistTitle,.PostListTitle{margin:0 0 24px;font-size:26px;font-weight:650;line-height:1.35;}.entrylistTitle a{color:inherit;text-decoration:none;}.category-link-list,#MyTag1_dtTagList{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,185px),1fr));width:100%;column-gap:24px;}#MyTag1_dtTagList :is(tbody,tr){display:contents;}.category-list-item,#MyTag1_dtTagList td[data-use-count]{display:flex;align-items:baseline;gap:8px;border-bottom:1px solid var(--border-subtle);padding:16px 0;overflow-wrap:anywhere;}#MyTag1_dtTagList td:not([data-use-count]){display:none;}.category-list-item a,#MyTag1_dtTagList a{color:var(--ink-primary);text-decoration:none;}.category-list-item a:hover,#MyTag1_dtTagList a:hover{color:var(--accent);}#MyTag1_dtTagList .small{font-size:13px;color:var(--ink-muted);}.ctp-month{scroll-margin-top:70px;margin:0 0 32px;}.ctp-month > h2{font-size:19px;margin:0;font-weight:650;color:var(--ink-secondary);}.ctp-month h3,.ctp-month .entrylistItemPostDesc{margin:0;}.ctp-month-status{color:var(--ink-muted);font-size:14px;}.ctp-month-entries button{cursor:pointer;margin-right:12px;background:var(--bg-subtle);color:var(--ink-primary);border:0;border-radius:5px;padding:4px 12px;}.ctp-page-index a[aria-current]{border-left:3px solid var(--accent);margin-left:-2px;padding-left:13px;color:var(--accent);font-weight:650;}\n";
  document.head.append(style);
});

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

(() => {
  'use strict';
  const {home} = window.CTP;
  function month(href) {
    let url;
    try { url = new URL(href, location.href); } catch (_) { return null; }
    if (url.origin !== location.origin || !url.pathname.startsWith(home)) return null;
    const match = /^p\/archive\/(\d{4})\/(0?[1-9]|1[0-2])\/?$/i.exec(url.pathname.slice(home.length));
    if (!match) return null;
    return {key:`${match[1]}-${match[2].padStart(2,'0')}`, label:`${match[1]}年${Number(match[2])}月`, href:url.href};
  }
  function months() {
    const known = new Map();
    for (const a of document.querySelectorAll('#sidebar_postarchive li a[href]')) {
      const item = month(a.href);
      if (item) known.set(item.key, item);
    }
    return Array.from(known.values());
  }
  async function entries(href, signal) {
    const response = await fetch(href, {signal});
    if (!response.ok) throw Error('Archive unavailable');
    const parsed = document.createElement('template'); parsed.innerHTML = await response.text();
    const list = parsed.content.querySelector('#mainContent .entrylist');
    if (!list) throw Error('Archive list missing');
    const posts = [];
    for (const entry of list.querySelectorAll('.entrylistItem')) {
      const title = entry.querySelector('.entrylistItemTitle[href]');
      if (!title) continue;
      const target = new URL(title.getAttribute('href'), href);
      if (target.origin !== location.origin) continue;
      const summary = entry.querySelector('.entrylistPostSummary');
      summary?.querySelectorAll('.c_b_p_desc_readmore').forEach(a => a.remove());
      posts.push({title:title.textContent.trim(), href:target.href, summary:summary?.textContent.trim(),
        meta:entry.querySelector('.entrylistItemPostDesc')?.textContent.trim()});
    }
    return posts;
  }
  window.CTP.archive = {month, months, entries};
})();

(() => {
  'use strict';
  const {home} = window.CTP;
  const categories = '.category-block-list .category-link-list .category-list-item a[href]';
  // Parse only real same-origin anchors. Collections, albums and month counts
  // can appear under the same native sidebar parent and are not post categories.
  function parse(root, selector, withCount=true) {
    const result = [];
    for (const a of root.querySelectorAll(selector)) {
      let href;
      try { href = new URL(a.getAttribute('href'), location.href); } catch (_) { continue; }
      if (href.origin !== location.origin) continue;
      const match = withCount ? a.textContent.trim().match(/^(.*?)(?:\s*[（(](\d+)[）)])?$/u) : [null, a.textContent.trim()];
      if (match && match[1]) result.push({name:match[1].trim(), href:href.href, count:match[2] || ''});
    }
    return result;
  }
  // One document request per catalog per page; short-lived session cache on later pages.
  const pending = new Map();
  function catalog(path, selector) {
    if (!pending.has(path)) pending.set(path, (async () => {
      const cacheKey = 'ctp:catalog:' + home + path;
      try {
        const cached = JSON.parse(sessionStorage.getItem(cacheKey));
        if (Date.now() - cached.at < 3600000 && Array.isArray(cached.items)) return cached.items;
      } catch (_) {}
      try {
        const response = await fetch(home + path);
        if (!response.ok) return [];
        const parsed = document.createElement('template'); parsed.innerHTML = await response.text();
        const items = parse(parsed.content, selector);
        if (items.length) try { sessionStorage.setItem(cacheKey, JSON.stringify({at:Date.now(), items})); } catch (_) {}
        return items;
      } catch (_) { return []; }
    })());
    return pending.get(path);
  }
  window.CTP.taxonomy = { parse, categories:() => catalog('categories', categories),
    tags:() => catalog('tag/', '#MyTag1_dtTagList td[data-use-count] a[href]'),
    sidebarTags:() => parse(document, '#sidebar_toptags li a[href]:has(.tag-count)'),
    sidebarCategories:() => parse(document, '#sidebar_postcategory li a[href]') };
})();

(() => {
  'use strict';
  const data = window.CTP.archive;
  function node(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  }
  function renderPost(post) {
    const article = node('article','entrylistItem');
    const title = node('h3','entrylistPosttitle');
    const link = node('a','',post.title); link.href = post.href;
    title.append(link); article.append(title);
    if (post.summary) article.append(node('p','entrylistPostSummary',post.summary));
    if (post.meta) article.append(node('p','entrylistItemPostDesc',post.meta));
    return article;
  }
  function timeline(native, current, months, railBody) {
    const timeline = node('div','ctp-timeline');
    const title = node('h1','entrylistTitle','随笔归档');
    native.before(title, timeline);
    const nav = node('nav','ctp-page-index'); nav.setAttribute('aria-label','归档月份');
    railBody.append(node('p','ctp-rail-title','按月浏览'), nav);
    const records = new Map(), queue = [];
    let active = 0;
    function queueMonth(record, priority=false) {
      if (record.state === 'queued' && priority) queue.splice(queue.indexOf(record), 1);
      else if (record.state !== 'idle') return;
      record.state = 'queued';
      if (priority) queue.unshift(record); else queue.push(record);
      drain();
    }
    async function drain() {
      if (active >= 3 || !queue.length) return;
      active++;
      const r = queue.shift(); r.state = 'loading'; r.status.textContent = '正在加载文章…';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      try {
        const entries = await data.entries(r.item.href, controller.signal);
        r.list.replaceChildren(...entries.map(renderPost));
        if (!entries.length) r.list.append(node('p','','本月暂无文章。'));
        r.state = 'ready';
      } catch (_) {
        r.status.textContent = '本月文章暂未载入。';
        r.state = 'error';
        const retry = node('button','','重试'); retry.type = 'button';
        retry.onclick = () => { retry.remove(); r.state = 'idle'; queueMonth(r,true); };
        const direct = node('a','','打开原始月份'); direct.href = r.item.href;
        r.list.replaceChildren(r.status, retry, direct);
      } finally { clearTimeout(timer); active--; drain(); }
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        observer.unobserve(entry.target); queueMonth(records.get(entry.target));
      }
    });
    for (const item of months) {
      const section = node('section','ctp-month'); const id = 'ctp-month-' + item.key;
      section.id = id; const heading = node('h2','',item.label); heading.id = id + '-name';
      section.setAttribute('aria-labelledby',heading.id); section.append(heading); timeline.append(section);
      const link = node('a','',item.label); link.href = '#' + id; nav.append(link);
      const list = node('div','ctp-month-entries'); section.append(list);
      const status = node('p','ctp-month-status','尚未载入'); status.setAttribute('role','status');
      const record = {section, item, link, list, status, state:'idle'}; records.set(section, record);
      if (item.key === current.key) {
        list.append(native); native.querySelector('.entrylistTitle')?.setAttribute('hidden','');
        record.state = 'ready'; link.setAttribute('aria-current','location');
      } else { list.append(status); observer.observe(section); }
      link.addEventListener('click', () => { queueMonth(record,true); });
    }
    // The active month follows the reading line, including when the last section is short.
    let frame;
    function highlight() {
      frame = 0;
      const rows = [...records.values()];
      let first = rows[0];
      for (const r of rows) if (r.section.getBoundingClientRect().top <= 95) first = r;
      if (scrollY > 0 && Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight) first = rows.at(-1);
      for (const r of rows) if (r === first) r.link.setAttribute('aria-current','location'); else r.link.removeAttribute('aria-current');
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(highlight); };
    window.addEventListener('scroll',schedule,{passive:true});
    if (months[0].key !== current.key) document.getElementById('ctp-month-' + current.key)?.scrollIntoView();
    return () => { observer.disconnect(); window.removeEventListener('scroll',schedule); cancelAnimationFrame(frame); };
  }
  let stop;
  window.CTP.onPage(({content, railBody}) => {
    stop?.(); stop = null;
    const current = data.month(location.href), native = content.querySelector('.entrylist');
    if (!current || !native) return;
    const observer = new MutationObserver(mount);
    function mount() {
      const months = data.months();
      if (!months.length) return;
      if (!months.some(m => m.key === current.key)) months.unshift(current);
      observer.disconnect(); stop = timeline(native, current, months, railBody);
    }
    observer.observe(document.querySelector('#sideBar') || document.documentElement, {subtree:true, childList:true});
    stop = () => observer.disconnect(); mount();
  });
})();

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

(() => {
  'use strict';
  // Keep the native nodes (including delayed view counters); one .day can hold several posts.
  function splitDays(flow) {
    const posts = [];
    for (const group of flow.querySelectorAll('.day')) {
      for (const title of group.querySelectorAll(':scope > .postTitle')) {
        const anchor = title.querySelector('a[href]');
        if (!anchor) continue;
        const row = document.createElement('article');
        row.className = 'day ctp-post-row';
        row.id = 'ctp-entry-' + (posts.length + 1);
        group.before(row);
        for (let node = title; node && !node.matches('.postSeparator');) {
          const next = node.nextElementSibling;
          row.append(node);
          if (next?.matches('.postTitle')) break;
          node = next;
        }
        const desc = row.querySelector('.c_b_p_desc[id]');
        if (desc) row.setAttribute('aria-describedby', desc.id);
        posts.push({name:anchor.textContent.trim(), href:'#' + row.id});
      }
      if (!group.querySelector('.postTitle')) group.remove();
    }
    return posts;
  }
  function railIndex(railBody, label, items) {
    const title = document.createElement('p');
    title.className = 'ctp-rail-title'; title.textContent = label;
    const nav = document.createElement('nav');
    nav.className = 'ctp-page-index'; nav.setAttribute('aria-label', label);
    for (const {name, href} of items) {
      const link = document.createElement('a'); link.href = href; link.textContent = name;
      nav.append(link);
    }
    railBody.append(title, nav);
  }
  // Only display passive announcement markup. Copying the native subtree wholesale would
  // duplicate IDs, widgets and their event handlers in the new rail.
  function noticeMarkup(html) {
    const template = document.createElement('template'); template.innerHTML = html;
    const safe = document.createDocumentFragment();
    function copy(source, parent) {
      for (const child of source.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) { parent.append(child.textContent); continue; }
        if (child.nodeType !== Node.ELEMENT_NODE || /^(SCRIPT|STYLE|IFRAME|OBJECT|TEMPLATE|NOSCRIPT)$/.test(child.tagName)) continue;
        if (!/^(P|DIV|SPAN|BR|A|STRONG|EM|B|I|UL|OL|LI|CODE)$/.test(child.tagName)) { copy(child, parent); continue; }
        const clone = document.createElement(child.localName);
        if (child.matches('a[href]')) {
          try {
            const url = new URL(child.getAttribute('href'), location.href);
            if (['http:', 'https:', 'mailto:'].includes(url.protocol)) clone.href = url.href;
          } catch (_) {}
        }
        copy(child, clone); parent.append(clone);
      }
    }
    copy(template.content, safe); return safe;
  }
  function mountNotice(railBody, config) {
    const notice = document.createElement('section'); notice.className = 'ctp-notice';
    let previous;
    function update() {
      const html = config.notice.html || document.querySelector('#sidebar_news_content')?.innerHTML || '';
      if (html === previous) return;
      previous = html;
      const body = noticeMarkup(html);
      if (!body.textContent.trim()) { notice.remove(); return; }
      const title = document.createElement('h2'); title.textContent = '公告';
      notice.replaceChildren(title, body); railBody.prepend(notice);
    }
    update();
    if (config.notice.html) return;
    const observer = new MutationObserver(update);
    observer.observe(document.querySelector('#sideBar') || document.documentElement, {subtree:true, childList:true, characterData:true});
    return () => observer.disconnect();
  }
  let stop;
  window.CTP.onPage(({content, article, railBody, config}) => {
    stop?.();
    if (article) return;
    const posts = splitDays(content);
    if (posts.length) {
      railIndex(railBody, '本页文章', posts);
      stop = mountNotice(railBody, config);
      return;
    }
    const directory = content.querySelector('.category-link-list, #MyTag1_dtTagList');
    if (directory) {
      const isTags = directory.id === 'MyTag1_dtTagList';
      const items = window.CTP.taxonomy.parse(content, isTags ? '#MyTag1_dtTagList td[data-use-count] a[href]' : '.category-link-list .category-list-item a[href]');
      railIndex(railBody, isTags ? '我的标签' : '随笔分类', items);
      return;
    }
    if (content.querySelector('.category-crumb-item, #myposts')) {
      const items = window.CTP.taxonomy.parse(content, '.entrylistItemTitle[href], #myposts .postTitl2 a[href]', false);
      railIndex(railBody, '本页文章', items);
      stop = mountNotice(railBody, config);
    }
  });
})();

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

(() => {
  'use strict';
  const data = window.CTP.taxonomy;
  function link(item) {
    const a = document.createElement('a'); a.href = item.href; a.textContent = item.name; return a;
  }
  function categoryBar({content, home, config}) {
    const first = content.querySelector('.day, .entrylistTitle:has(.category-crumb-item)');
    const options = config.categories;
    if (!first || !options.show) return;
    const bar = document.createElement('nav'); bar.className = 'ctp-category-bar'; bar.setAttribute('aria-label', '分类筛选');
    let catalog = [], previous;
    function update() {
      if (!first.isConnected) return;
      const all = catalog.length ? catalog : data.sidebarCategories();
      const include = Array.isArray(options.include) ? options.include : [];
      const max = Number.isFinite(options.max) ? Math.max(0, options.max) : 8;
      const selected = (include.length ? include.map(name => all.find(c => c.name === name)).filter(Boolean) : all).slice(0, max);
      const signature = JSON.stringify(selected);
      if (signature === previous) return;
      previous = signature;
      if (!selected.length) { bar.remove(); return; }
      const homeLink = link({name:'全部', href:home});
      if (first.matches('.day')) homeLink.setAttribute('aria-current','page');
      bar.replaceChildren(homeLink);
      for (const cat of selected) {
        const a = link(cat);
        if (a.pathname === location.pathname) a.setAttribute('aria-current','page');
        if (cat.count) { const n = document.createElement('small'); n.textContent = cat.count; a.append(' ', n); }
        bar.append(a);
      }
      first.before(bar);
    }
    const observer = new MutationObserver(update);
    observer.observe(document.querySelector('#sideBar') || document.documentElement, {childList:true, subtree:true});
    update(); data.categories().then(items => { catalog = items; update(); });
    return () => observer.disconnect();
  }
  function articleTaxonomy({content}) {
    const title = content.querySelector('#post_detail .postTitle');
    if (!title) return;
    const words = (document.querySelector('meta[name="keywords"]')?.content || '').split(/[,，]/).map(s => s.trim()).filter(Boolean);
    let cats = [], tags = [], previous;
    const groups = document.createElement('div'); groups.className = 'ctp-post-taxonomy';
    function update() {
      if (!title.isConnected) return;
      // Live post accessories are definitive. Keywords can also name collections;
      // when the post slots are absent, link only names with known taxonomy URLs.
      const resolve = (selector, directory) => {
        const native = content.querySelector(selector);
        if (native) return data.parse(native, 'a[href]', false);
        return words.map(s => directory.find(item => item.name === s)).filter(Boolean);
      };
      const items = [resolve('#BlogPostCategory', [...cats, ...data.sidebarCategories()]),
                     resolve('#EntryTag', [...tags, ...data.sidebarTags()])];
      const signature = JSON.stringify(items);
      if (signature === previous) return;
      previous = signature;
      groups.replaceChildren();
      for (const [i, group] of items.entries()) {
        if (!group.length) continue;
        const nav = document.createElement('nav');
        nav.className = i ? 'ctp-post-tags' : 'ctp-post-categories';
        nav.setAttribute('aria-label', i ? '文章标签' : '文章分类');
        nav.append(...group.map(link)); groups.append(nav);
      }
      if (!groups.childElementCount) { groups.remove(); return; }
      let header = title.nextElementSibling;
      if (!header?.matches('.ctp-post-meta')) {
        header = document.createElement('div'); header.className = 'ctp-post-meta'; title.after(header);
      }
      header.append(groups);
    }
    const observer = new MutationObserver(records => {
      if (records.some(r => r.target.closest?.('#sideBar, #blog_post_info_block') ||
        [...r.addedNodes].some(n => n.nodeType === 1 && (n.matches('#sideBar, #blog_post_info_block') || n.querySelector('#blog_post_info_block'))))) update();
    });
    observer.observe(document.querySelector('#main'), {childList:true, subtree:true});
    update();
    if (words.length) {
      data.categories().then(result => { cats = result; update(); });
      data.tags().then(result => { tags = result; update(); });
    }
    return () => observer.disconnect();
  }
  let stop;
  window.CTP.onPage(page => { stop?.(); stop = page.article ? articleTaxonomy(page) : categoryBar(page); });
})();
