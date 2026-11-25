# `cnblogs-document-theme` 一手源码审计报告

- **审计对象**：只读参考仓库 `cnblogs-document-theme/`（版本 `v7.39 · 2026-11-18`）
- **对应 Wayfinder Ticket**：`WF-02`（`my-theme/docs/wayfinder/tickets/WF-02-cnblogs-theme-dom-and-architecture-audit.md`）
- **审计目标**：厘清博客园 `Custom` 皮肤的真实 DOM 契约、不可破坏的底层 CSS/加载硬约束、JS 功能模块的复用与解耦边界，以及双形态构建与自动化验证体系，为 `my-theme`（`ctp-docs`）提供可靠工程基线。

---

## 1. 博客园真实 DOM 契约与底层硬约束

### 1.1 各页面真实 DOM 结构（2026-11 实测）

来源：`css/theme-v7.css:7-22`、`css/theme-v7.css:360-377`、`snippets/footer-script-v7.html:429-442`、`snippets/footer-script-v7.html:1360-1372`、`preview/home-v7.html`、`preview/post-v7.html`、`_dev-tools/verify-tagpage.js:1-6`。

#### 全站顶层骨架
```text
body.skin-custom.has-navbar
├── #top_nav                          # 博客园全站导航（可隐藏）
├── #page_begin_html                  # 页首 HTML 代码字段（在 body 内，非 head）
├── #home
│   ├── #header                       # #blogTitle + #navigator > .blogStats
│   ├── #main
│   │   ├── #mainContent > .forFlow   # 正文 / 列表内容（DOM 顺序在前）
│   │   └── #sideBar > #sideBarMain   # 侧栏（DOM 顺序在后）
│   │       ├── #sidebar_news         # 公告（内含 h3 + #blog-news）
│   │       ├── #blog-calendar        # 日历（通常隐藏）
│   │       └── #leftcontentcontainer # 注意：名字带 left，实际装的是右栏侧边部件
│   │           └── #blog-sidecolumn  # 分类/归档/标签/排行等（由 loadBlogSideColumn 异步 XHR 填充）
│   └── #footer
└── #page_end_html                    # 页脚 HTML 代码字段
```

> **关键陷阱**：
> 1. 真实 DOM 中**不存在 `#rightColumn`**，且 `#leftcontentcontainer` 虽然名字带 `left`，实际位于 `#sideBarMain` 内部，装的是博客园异步加载的右侧边栏卡片（`css/theme-v7.css:19-20, 372-377`）。
> 2. `#blog-sidecolumn` 是博客园通过 `loadBlogSideColumn` **异步 XHR 填充**的，实测比 `DOMContentLoaded` / `load` 晚约 100~200ms（`snippets/footer-script-v7.html:2792-2813, 2965-2967`）。

#### 各页面正文区关键选择器

| 页面类型 | 正文区核心 DOM 选择器 | 关键事实 / 陷阱 | 来源引用 |
| --- | --- | --- | --- |
| **首页 / 随笔列表** | `#mainContent .day` > `.postTitle a` / `.postCon` / `.postDesc` | 同日多篇文章会被包在同一个 `.day` 里，需 `splitDayGroups()` 拆成单篇；列表页 `.day` 内**不包含**分类/标签链接 | `css/theme-v7.css:14`, `footer-script-v7.html:568-605, 1362` |
| **文章详情页** | `#post_detail` > `#topics` > `.post` > `h1.postTitle` + `.postBody` (`#cnblogs_post_body.blogpost-body.cnblogs-markdown` + `#blog_post_info_block`) + `.postDesc` | 实测**没有 `#EntryTag` 和 `#BlogPostCategory`**，`#blog_post_info` 初始为空；文章分类+标签真实来源是 `<meta name="keywords">`（末位通常为分类）配合 `/categories` 核对 | `css/theme-v7.css:1604-1641`, `footer-script-v7.html:1363-1372`, `verify-post.js:29-52` |
| **归档页** (`/p/archive/YYYY/M`) | `#mainContent .entrylist` > `.entrylistItem` > `.entrylistItemTitle` / `.entrylistPostSummary` / `.entrylistItemPostDesc` | 原生仅按单月输出；归档根路径会 404，必须带 `{ym}`（如 `2026/11`，月份不补零）；全站月份列表取自 `#sidebar_postarchive a` | `css/theme-v7.css:492-511, 1012-1042`, `dist/paste/页首.html:32, 93-99`, `footer-script-v7.html:2235-2248` |
| **分类页** (`/categories`) | `.category-block` > `.category-block-title` + `.category-block-list` > `.category-list-item a` | 链接文本形如 `后端(34)`，名称与篇数在同一个文本节点中 | `css/theme-v7.css:1429-1440`, `footer-script-v7.html:1396-1412` |
| **标签云页** (`/tag`) | `#taglist_main` > `#taglist_title_wrap` > `h3#taglist_title` + `#taglist table` | 原生用 `<table>` 布局，需 CSS 网格化改造 | `css/theme-v7.css:1323-1427`, `verify-tagpage.js:1-6` |
| **标签文章页** (`/tag/<name>`) | `.PostList` > `.postTitl2 a` | 与首页 `.day` 选择器不同，构建文章索引需兼容四套选择器 | `css/theme-v7.css:1286-1322`, `footer-script-v7.html:430-442` |
| **评论区** | `#blog-comments-placeholder`、`.commentform`、`#btn_comment_submit`、`.blog_comment_body` | 博客园异步加载，暗色模式需显式覆写表单、按钮与评论体样式 | `css/theme-v7.css:518-519, 2161-2183, 2341-2409` |
| **代码块** | Markdown：`pre > code.language-*`；富文本：`.cnblogs_code pre`；Prism 异步注入 `.line-numbers-rows` | 富文本 `.cnblogs_code` 自带表格行号不可重复加工；博客园 `prism-line-numbers` 在客户端异步加载，需等 `load` 后再判定是否自绘行号 | `css/theme-v7.css:1701-1757`, `footer-script-v7.html:707-776, 849-881` |

---

### 1.2 不可破坏的 7 项底层硬约束（建议 `ctp-docs` 全盘保留）

1. **纯 CSS Grid 定位与 `#sideBar { display: contents }`**（`css/theme-v7.css:21-22, 378-432`）
   - 博客园 DOM 顺序固定为 `#mainContent` 在前、`#sideBar` 在后。通过 `#sideBar { display: contents !important; }` 把 `#sideBarMain` 摊平提升为 `#main` 的直接 Grid 项，无需 JS 搬运节点，彻底消除节点迁移造成的布局跳动。
   - 脚本新建的左栏 `#qb-left` 插入在 `#mainContent` 之前并显式指定 `grid-column: 1`。
   - 窄屏（`<=860px`）切为 `flex-direction: column` 时必须显式设 `align-items: stretch` 与 `max-width: 100%`，否则全局 `align-items: start` + `width: auto !important` 会让宽代码块把整页撑出横向滚动条（`css/theme-v7.css:2473-2499`）。
2. **首帧闸门与 `--qb-field` 标记协议**（`css/theme-v7.css:25-45`、`dist/paste/样式.min.css`、`_dev-tools/gen-bundle.py:93-109`、`_dev-tools/gen-deploy.py:167-220`）
   - 必须写在博客园「页面定制 CSS 代码」字段（编译为 `<head>` 中阻塞渲染的 `custom.css`）：
     - `html{--qb-field:2}` 表示托管外链模式（字段里只放首帧骨架 + 闸门 + View Transition）；`--qb-field:1` 表示完整内联模式。
     - 闸门规则：`html:not(.qb-ready) #home, html:not(.qb-ready) #top_nav { opacity: 0; animation: qb-unlock 0s linear 2.5s forwards; }`。
     - **绝不能用 `visibility: hidden`**：会导致 `offsetParent === null`，从而使目录提取的可见性过滤把所有标题判为不可见（`css/theme-v7.css:42-43`）。
     - **双层超时兜底**：JS 侧 1.5s 强制 `unlock(true)`，CSS 侧 2.5s 纯动画放行，防脚本被拦截时白屏（`footer-script-v7.html:2969-2973`）。
3. **跨文档 View Transition + 解析期静态顶栏**（`css/theme-v7.css:47-108`、`dist/paste/页首.html:15-18, 73-167`、`_dev-tools/gen-deploy.py:211-247`）
   - `@view-transition { navigation: auto; }` 必须在 render-blocking 的「页面定制 CSS 代码」字段中声明；放进外链 CSS 会晚于新页首绘而失效。
   - 顶栏命名 `view-transition-name: qb-nav`，且 `::view-transition-old(qb-nav)` 与 `::view-transition-new(qb-nav)` 均设为 `animation: none; opacity: 1`，根视图仅新页淡入（旧页保持不透明），消除切页白闪。
   - 页首 HTML 在解析期通过 `document.write` 同步输出与运行时同构的顶栏 HTML（带 `data-qb-pre="1"`），确保过渡快照拍到的不是空壳；同时图片/SVG 必须写死 `width`/`height` 属性防无样式瞬间巨图闪动（`snippets/head-nav-v7.html:32-33`）。
4. **首帧暗色预判脚本**（`dist/paste/页首.html:50-70`）
   - 在页首 HTML 最早位置同步执行 `localStorage > config.dark > prefers-color-scheme` 判定，立刻给 `<html>` 加上暗色类名；CSS 字段里用 `html.<dark-class>` 而非 `@media (prefers-color-scheme: dark)` 覆写顶栏颜色，避免与手动切换浅色打架（`_dev-tools/gen-deploy.py:242-246`）。
5. **`document.write` 同步加载与博客园 `defer` 改写规避**（`dist/paste/页首.html:182-185, 210-235`、`_dev-tools/gen-deploy.py:32-42`）
   - 博客园会自动把页首字段中的外部 `<script src>` 改写为 `defer`，导致脚本推迟到首绘之后；而内联 `<script>` 不会被改写，通过内联脚本 `document.write` 拆拼 `<scr` + `ipt>` 注入外链 `<link>` 与 `<script>` 可保持解析期并行/同步加载。
   - **HTML 校验器坑**：博客园后台 HTML 校验器不跳过注释与脚本，注释和字符串中不得出现未配对尖括号或完整 `</script>` 字面量（`snippets/head-nav-v7.html:10-11`、`dist/paste/页首.html:185`）。
6. **小时级缓存键 + 双源 CDN 熔断回退 + 内嵌 CSS 兜底**（`dist/paste/页首.html:171-235`、`_dev-tools/gen-bundle.py:98-110`、`_dev-tools/gen-deploy.py:925-939`）
   - jsDelivr 浏览器缓存 7 天 / 边缘 12 小时，URL 拼接 `?d=YYYYMMDDHH`（按小时）确保发版最迟 1 小时生效。
   - 主源 `cdn.jsdelivr.net` + 备源 `fastly.jsdelivr.net`（同一仓库 `@master`），主源失败记入 `localStorage` 熔断 1 小时；不用 `gcore`（分支缓存两周且 purge 无效），不用 `blog-static.cnblogs.com`（校验 Referer 导致自定义域名 403 且易版本错配）。
   - 若 CSS 双源均失败（`window.__qbCssDead === 2`），JS 合并包自动将内嵌的压缩 CSS 注入 `<style>`，绝不裸奔。
7. **归档页预隐藏与 `MutationObserver` 抢帧启动**（`css/theme-v7.css:492-506`、`dist/paste/页首.html:5-10`、`footer-script-v7.html:2785-2932`）
   - 页首按 URL 正则提前给 `<html>` 加归档页标记，预隐藏原生按月 `.entrylist`（带 3s 兜底），待全站时间线与首月条目就位后再松闸。
   - `MutationObserver` 监听 `#mainContent` 与 `#leftcontentcontainer`（侧栏最后子节点）同时就位才 `boot()`，由 `settle()` 按帧等待异步侧栏/归档/分类请求（各设帧上限：侧栏 30 帧、分类 30 帧、归档 60 帧）后统一松闸。

---

## 2. JS 模块盘点与耦合度评估

源码主文件为 `snippets/footer-script-v7.html`（2975 行），压缩后与 CSS 合并产出 `dist/document-theme.js`（2171 行，约 128 KB）。下表按模块拆解其职责、耦合度与新主题复用策略：

| # | 功能模块 | 源码位置（`footer-script-v7.html`） | 核心职责 | 耦合度评估 | `ctp-docs` 复用建议 |
| --- | --- | --- | --- | --- | --- |
| 1 | **站点上下文与配置合并** (`APP`/`HOME`/`SITE_NAME`/`resolveHref`/`CFG`) | `L24-177` | 自动推导博客路径与站点名、`{ym}` 模板替换、2 层深合并 `LS_CONFIG` | **低耦合**（仅 `L158-175` 强调色派生态偏旧机制） | **直接复用核心逻辑**，升级为 `window.THEME_CONFIG` 并接入 Catppuccin Token 体系 |
| 2 | **首帧启动与就绪闸门** (`bootOnce`/`boot`/`settle`/`sideReady`/`unlock`) | `L2694-2974` | `MutationObserver` 抢帧启动、异步侧栏/归档/分类等待、1.5s 强解锁 | **中耦合**（等待 `#leftcontentcontainer`/`#blog-sidecolumn` 与 `#qb-left`） | **复用状态机框架**，按新布局调整等待条件（例如若某页面无右栏则不阻塞） |
| 3 | **左栏文章目录 (`buildToc`)** | `L356-427` | 扫描 `#cnblogs_post_body` 的 `h1–h4`、去重编号正则 `NUM_HEAD`、平滑滚动、rAF ScrollSpy + 目录自动跟随 | **中耦合**（依赖 `makePanel` 与 `.qb-toc-list`/`.qb-lv*`） | **核心保留并视觉重构**：复用扫描/编号识别/ScrollSpy 逻辑，重写容器 DOM 与样式以匹配新视觉 |
| 4 | **列表页左侧文章索引 (`buildPostList`)** | `L429-520` | 兼容 4 类列表页选择器生成左栏文章速览与溢出渐变提示 | **中耦合**（强绑定左栏面板形态） | **按需复用数据提取**，取决于 WF-04 列表页左栏是否保留文章速览 |
| 5 | **顶栏渲染与吸顶修复 (`renderNav`/`markNav`/`hoistNav`)** | `L195-321, 540-566` | 接管页首预渲染顶栏、提升至 `body` 首位修复 `sticky` 行程、当前页高亮 | **高耦合**（强绑定 `.qb-nav` 旧结构与按钮布局） | **保留 `hoistNav` 与预渲染接管机制，重写顶栏 DOM 结构与样式** |
| 6 | **公告接管 (`renderNotice`)** | `L322-354` | 配置 `notice.html` 时隐藏原生 `#blog-news` 并渲染自定义公告 | **高耦合**（硬挂载在 `#sidebar_news` / `#sideBarMain`） | **重写挂载点**，随 WF-04 对公告/作者简介的新摆放位置调整 |
| 7 | **同日多篇拆分与分页增强 (`splitDayGroups`/`enhancePager`)** | `L568-704` | 把同日多篇 `.day` 拆成单篇卡片；规范化分页按钮与隐藏单页多余导航 | **低耦合**（纯博客园原生 DOM 清洗） | **高优先级直接复用**（仅调整生成的容器类名） |
| 8 | **代码块增强 (`enhanceCode`/`settleCode`/`copyText`)** | `L706-890` | 跳过富文本 `.cnblogs_code`、提取语言标签、复制（Clipboard + execCommand 回退）、>34 行自动折叠、等 `load` 后按需自绘行号 | **中耦合**（纯逻辑清晰，DOM 壳为 `.qb-code`/`.qb-code-bar`） | **复用全部交互逻辑**，按 Catppuccin + `frontend-design` 重新设计工具条与折叠样式 |
| 9 | **Favicon 强接管 (`initFavicon`)** | `L892-1007` | 将页首 `<link rel="icon">` 搬进 `<head>` 并用 `MutationObserver` 对抗园方覆盖 | **低耦合**（纯 `<head>` 操作） | **直接复用**（可设为配置项按需开启） |
| 10 | **暗色模式 (`initDarkMode`/`darkPref`/`syncDarkClass`)** | `L1009-1068` | 三层优先级（`localStorage > config > 系统`）、监听 `prefers-color-scheme` 实时切换 | **低耦合**（仅切换 `html`/`body` 类名） | **直接复用逻辑**，改为切换 `data-theme="latte|mocha"`（或对应类名）并同步按钮状态 |
| 11 | **顶栏主题色取色器 (`THEMES`/`applyTheme`/`initTheme`)** | `L1069-1248` | 6 套强调色明暗配对、弹层交互、注入 `<style id="qb-theme-accent">` | **高耦合**（配色表为旧 6 色，UI 绑定顶栏下拉弹层） | **按 WF-05 决策重做或裁剪**（接入 Catppuccin Accent 体系） |
| 12 | **文章页增强 (`enhancePost`: 阅读时长/字数/锚点/版权)** | `L1249-1359` | 中英文分词字数统计、阅读分钟数、标题悬停锚点（无文本防污染目录）、文末版权块 | **中耦合**（计算逻辑独立，插入位置绑定 `.postTitle` / `#cnblogs_post_body`） | **复用数据计算与锚点防污染逻辑**，按 WF-04 重新设计元信息与版权块摆放 |
| 13 | **分类与标签体系 (`initTaxonomy`/`loadCats`/`splitTaxo`/`initCatBar`)** | `L1360-1679` | 抓取 `/categories`（7 天缓存）、解析 `meta[name=keywords]` 拆出分类+标签、渲染列表页分类筛选条与文章页胶囊 | **低耦合（数据层）/ 中耦合（视图层）** | **强烈建议直接复用数据层**（`loadCats`/`parseCats`/`postKeywords`/`splitTaxo`/`pickCats`），重写渲染层以适配新组件形态 |
| 14 | **宽表格与 Markdown 补全 (`enhanceTables`/`enhanceMarkdown`)** | `L1680-1731` | 给宽表套横向滚动壳 + 首列吸附滚动阴影；补全 Markdown 语义元素 | **低耦合** | **直接复用** |
| 15 | **移动端目录抽屉 & 导航抽屉 (`initMobileToc`/`initMobileMenu`)** | `L1732-1972` | `<860px` 克隆桌面目录与导航到抽屉，带 ESC/遮罩关闭与断点变化自动收起 | **高耦合**（依赖桌面 DOM 结构与 `860px` 断点） | **复用交互模式与无障碍收口逻辑**，按新断点与视觉重写 |
| 16 | **续读记忆 + Toast (`initResume`/`showToast`)** | `L1973-2107` | 按路径存滚动比例（带 LRU 清理）、`load` 后恢复并弹出「回到开头」Toast | **低耦合** | **直接复用逻辑**，按 Catppuccin 样式重绘 Toast |
| 17 | **回到顶部进度环 (`createBackToTop`)** | `L2154-2230` | SVG 圆环滚动进度 + 键盘支持 + 回到顶部 | **低耦合** | **可复用或按新视觉重新摆放** |
| 18 | **全站归档时间线 (`buildFullArchive` 及缓存/并发队列)** | `L2231-2685` | 从 `#sidebar_postarchive` 读月份、并发队列 + `IntersectionObserver` 懒加载各月文章、localStorage 24h 缓存、左侧年月索引 | **低耦合（抓取/缓存层）/ 中耦合（时间线 DOM）** | **直接复用抓取、解析、队列与缓存层**，按新视觉重写时间线与索引 UI |
| 19 | **图片懒加载 (`lazyImages`) & 页脚署名 (`initCredit`)** | `L530-539, 2108-2153` | 正文图片加 `loading="lazy"`；页脚插入主题署名 | **低耦合** | `lazyImages` 直接复用；署名按个人主题需要自行定义 |

> **关键总结**：`cnblogs-document-theme` 的 JS 中，**数据提取、缓存、博客园 DOM 兼容修复与交互状态机**（约占 65% 代码量）高度可复用且含大量线上实测避坑逻辑；真正需要按 `ctp-docs` 重写的是**视图渲染层（顶栏、卡片/面板容器、分类条、文章元信息、版权块、移动端抽屉）与 CSS 样式层**。

---

## 3. 构建流水线与本地验证体系

### 3.1 双形态构建流水线（零外部构建依赖，纯 Python 3）

来源：`_dev-tools/gen-min.py`、`_dev-tools/gen-footer-min.py`、`_dev-tools/gen-bundle.py`、`_dev-tools/gen-deploy.py`、`_dev-tools/bump-version.py`。

```text
源码真源
├── css/theme-v7.css                 ──(gen-min.py)────────► css/theme-v7.min.css (~56 KB)
└── snippets/footer-script-v7.html   ──(gen-footer-min.py)─► snippets/footer-script-v7.min.html (~70 KB)
                                                                       │
        ┌──────────────────────────────────────────────────────────────┘
        ▼  (gen-bundle.py: 校验版本一致 + json.dumps 嵌 CSS + 条件注入器)
   dist/document-theme.js (~128 KB，含 CSS 兜底注入 + 全量 JS)
        │
        ▼  (gen-deploy.py: 按模板生成后台粘贴包，支持 --check 校验)
   ├── dist/paste/
   │   ├── 样式.min.css              (3.0 KB，单行压缩：--qb-field:2 + 顶栏骨架 + 闸门 + View Transition)
   │   ├── 页首.html                 (12.5 KB，通用版：配置留空 + 首帧暗色 + 预渲染顶栏 + 双源加载器)
   │   └── 页首-我的站.html          (12.6 KB，作者预填配置版)
   ├── dist/readable/
   │   └── 样式-字段可读版.css        (与 样式.min.css 等价，带完整注释)
   └── dist/fallback/
       └── 样式-内联备份.css          (56.8 KB，--qb-field:1 + 完整 CSS，应急内联兜底)
```

- **版本一致性门禁**：`gen-bundle.py:55-68` 强制校验 CSS 与 JS 头部的版本 token 完全一致，防止只编了一半产物。
- **无损压缩器特性**：
  - `gen-min.py` 保护括号内空白（避免破坏 `calc()` / `rgba()`）。
  - `gen-footer-min.py` 先将字符串与正则字面量替换为占位符再删注释和缩进，**保留换行符**以保证 JS ASI 语义不变且出错可按行定位（`gen-footer-min.py:12-16`）。
- **单向真源原则**：`dist/` 下所有粘贴产物均由脚本生成，支持 `--check` 校验源码与产物同步。

### 3.2 本地快照预览与自动化验收体系

来源：`preview/home-v7.html`、`preview/post-v7.html`、`_dev-tools/shot-docs.js`、`_dev-tools/verify-*.js`。

1. **真实 DOM 快照（`preview/`）**：
   - `preview/home-v7.html`（50 KB）与 `preview/post-v7.html`（34 KB）保存了博客园真实页面的完整 HTML 骨架（含 `blog-common.min.css`、`prism-tomorrow.css`、`#top_nav`、`#home`、`#main`、`#sideBar` 等真实 ID/Class）。
   - 离线预览时只需将外链 CSS/JS 路由替换为本地文件（或直接通过本地静态服务器打开并注入本地产物），即可在无外网、不污染线上博客的前提下精确还原博客园 DOM 权重冲突与布局表现。
2. **自动化行为验证（`_dev-tools/verify-*.js`，共 14 个脚本）**：
   - 覆盖场景：代码块 4 种形态（`verify-code.js`）、文章增强幂等性/字数不计版权/锚点不污染目录（`verify-post.js`）、分类与标签拆分及容错（`verify-taxonomy.js` / `verify-catbar.js`）、移动端抽屉与窄屏不横溢（`verify-mobile.js` / `verify-v721.js`）、配置合并与暗色三层优先级（`verify-config.js` / `verify-defaults.js`）、双源 CDN 熔断回退（`verify-loader.js`）、源码 vs 压缩版 DOM 对拍（`verify-min-parity.js`）。
   - 核心方法：使用真实博客园 DOM 骨架构造离线假页 + Playwright 拦截路由并执行断言。
   - 需避开的旧坑：部分上游 `verify-*.js` 硬编码了作者本地 Windows 路径（如 `verify-post.js:16`、`verify-min-parity.js:5`），新主题编写验证脚本时必须全部使用相对路径（`path.resolve(__dirname, '..')`）。
3. **视觉截图自检（`_dev-tools/shot-docs.js`）**：
   - 拦截 CDN 请求替换为本地构建产物，等待 `html.qb-ready` 松闸后，在桌面端（`1440×900`，浅色 + 暗色）和移动端（`390px`）分别截首页、文章页与抽屉态，直接用于视觉评审。
4. **当前工作区实测运行时环境（最小依赖评估）**：
   - `Node.js`：`v24.18.0`（已就绪）
   - `Python`：`3.14.10`（已就绪，可直接运行零依赖构建脚本）
   - `Playwright`：当前环境未安装 Node 版 `playwright-core`，但已存在 **`/root/venv/bin/playwright`**（Python 版 Playwright CLI 与运行时），新主题可直接基于 Python Playwright（或按需安装 Node `playwright`）驱动离线 HTML 快照渲染、DOM 断言与多视口截图自检，无需依赖线上博客园站点即可跑通完整闭环。
