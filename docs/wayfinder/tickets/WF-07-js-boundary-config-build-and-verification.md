---
id: WF-07
title: 确定 JS 复用边界、配置契约、构建产物与验收基线
parent: WF-MAP
labels:
  - wayfinder:grilling
status: closed
assignee: dev
blocked_by:
  - WF-02
  - WF-04
---

## Question

结合 [拆解 cnblogs-document-theme 的 DOM 契约、CSS 机制与 JS 模块边界](./WF-02-cnblogs-theme-dom-and-architecture-audit.md) 与 [确定页面信息架构、布局形态与交互组件摆放方案](./WF-04-layout-ia-and-component-placement.md)，拍板工程架构与交付契约：

1. **目录结构与 JS 复用边界**：`my-theme/` 的源码组织方式；哪些 JS 逻辑可直接复用迁移，哪些因布局/组件重塑需要重写？
2. **轻配置契约**：`window.THEME_CONFIG` 暴露哪些配置字段、默认值如何设计、如何与个人站点数据解耦？
3. **构建与分发产物**：如何生成「自托管双源 CDN 轻量粘贴版（首帧 CSS + 页首 HTML）」与「单文件内联备份版」两套产物，缓存刷新与回退策略如何约定？
4. **本地预览与验收闭环**：基于真实博客园 DOM 快照的预览方式、自动化检查项与视觉截图回归基线如何定义？

## Resolution

1. **模块化源码结构与零构建依赖**
   - 全程采用原生 CSS/JS + 纯 Python 3 零依赖构建脚本（不引入 Node/Webpack/Vite）。
   - 目录划分为：`src/css/`（`tokens.css` / `critical.css` / `layout.css` / `prose.css` / `pages.css`）、`src/js/`（`core/` 底层复用、`data/` 数据提取与缓存复用、`ui/` 新视觉视图层重写）、`src/templates/head-loader.html`、`scripts/`、`preview/`、`dist/`（`ctp-docs.css/.min.css`、`ctp-docs.js`、`paste/` 托管粘贴包、`fallback/` 单文件内联备份）。
2. **轻配置契约 (`window.THEME_CONFIG`)**
   - 扁平字段解耦代码与个人站点数据：`siteName`、`accent`（`mauve|blue|teal|lavender`）、`defaultTheme`（`system|latte|mocha`）、`nav`（支持 `{ym}` 动态年月）、`notice.html`、`categories`（`show`/`include`/`max`）、`code.collapseLines`（默认 `34`）、`copyright`（`show`/`license`）、`resume.show`、`favicon`。留空即开箱即用。
3. **双形态分发与 CDN 容灾**
   - 主源 `cdn.jsdelivr.net/gh/<owner>/<repo>@<branch>/...` + 备源 `fastly.jsdelivr.net/gh/<owner>/<repo>@<branch>/...`，通过构建参数注入仓库坐标；
   - 保留 `?d=YYYYMMDDHH` 小时级缓存键、主源失败 1 小时 `localStorage` 熔断、以及 CSS 双源全挂时由 `ctp-docs.js` 自动内嵌注入压缩 CSS；
   - 同步产出 `dist/fallback/样式-内联备份.css`（`--ctp-field:1`）作为离线应急兜底。
4. **本地预览验收闭环与边缘细节收口**
   - 在 `my-theme/preview/` 沉淀博客园真实 DOM 离线快照（首页、文章页、归档页、标签页），以结构断言（`#sideBar` 隐藏但数据提取完整、左栏标尺目录与 ScrollSpy、同日多篇拆分、Highlight.js/Prism 双引擎代码块与折叠、`<960px` 零横向溢出）+ 多视口截图（`1440×900` / `1920×1080` / `390×844` × `Latte/Mocha`）作为验收基线。
   - **字体与性能**：默认零阻塞系统无衬线栈，优先命中本机 `IBM Plex Sans` / `JetBrains Mono` / `Maple Mono`，可选非阻塞 Web 字体（`font-display: swap`），不拖慢首帧闸门。
   - **边缘页面与打印**：评论区对齐 `Mantle` + `Surface 0` 细线体系；MathJax/KaTeX 继承 `--ink-primary`；`@media print` 隐藏顶栏/左栏/抽屉并切为白底深字。
   - **最终交付形态**：汇总为单一自包含的 `my-theme/docs/DESIGN-SPEC.md` 交接实施。
