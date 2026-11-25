# `ctp-docs` · 基于 Catppuccin 的博客园主题设计方案与技术规格（Design Spec）

> **主题代号**：`ctp-docs`（可随时更名）  
> **主工作目录**：`my-theme/`（`cnblogs-document-theme/` 全程只读参考）  
> **适用皮肤**：博客园 `Custom（自定义）` 皮肤  
> **决策溯源**：[Wayfinder 规划地图](./wayfinder/MAP.md)（`WF-01` ~ `WF-07` 全部收敛）

---

## 1. 产品定位与设计原则

- **内容与受众定位**：面向开发者的个人深度技术博客与数字花园，服务长文精读、高频代码块与数据表格展示。
- **视觉表面哲学**：彻底告别「灰底 + 浮空圆角白卡 + 投影」的 SaaS 卡片模板，采用**连续画布 + Catppuccin 三阶平面分层**——正文铺于 `Base`，左栏目录与代码块落在 `Mantle`，顶栏壳层落在 `Crust`；全局无重阴影，仅用 `1px` `Surface 0/1` 细线表达结构边界。
- **全站唯一视觉记忆点（One Bold Memorable Thing）**：**左栏「标尺导轨式」自动目录（Reading Rail）**——极细纵向底轨 + 当前阅读章节的高对比度 `3px` 竖条游标与加粗强调色文字（无背景色块叠加），一眼传达「开发者文档精读工作台」气质，页面其余区域保持克制与安静。
- **反模板化硬性红线（源自 `SKILL.md`）**：
  1. 禁用无意义的 ALL-CAPS 小眉标（eyebrow）与非序列内容的 `01 / 02 / 03` 装饰编号；
  2. 禁用机械的 `A · B · C` 中点串联元信息与按钮/链接尾部统一的 `→` 装饰箭头；
  3. 禁用正文 `H2` 下方全宽横线（改用 `2.25em` 上留白自然分段）与全局卡片 hover 上浮 / 段落淡入上滑入场动画；
  4. 动效仅响应用户明确操作（抽屉展开、目录游标跟随、复制反馈、跨页 View Transition），严格尊重 `prefers-reduced-motion`。

---

## 2. 色彩系统（Catppuccin `Latte` + `Mocha`）

一手色值与 WCAG 2.1 对比度评测详见 [catppuccin-palette-guidelines.md](./research/catppuccin-palette-guidelines.md)。

### 2.1 语义 Token 映射

| 语义 Token | Catppuccin 角色 | `Latte`（浅色） | `Mocha`（暗色） | 用途与无障碍约束 |
|---|---|---|---|---|
| `--bg-canvas` | `Base` | `#eff1f5` | `#1e1e2e` | 主阅读画布 |
| `--bg-rail` / `--bg-code` | `Mantle` | `#e6e9ef` | `#181825` | 左栏导轨、代码块底、文末版权块、抽屉 |
| `--bg-chrome` / `--bg-code-head` | `Crust` | `#dce0e8` | `#11111b` | 52px 顶栏壳层、代码块顶栏 |
| `--bg-subtle` | `Surface 0` | `#ccd0da` | `#313244` | 行内代码底、标签胶囊、分类筛选默认态 |
| `--bg-subtle-hover` | `Surface 1` | `#bcc0cc` | `#45475a` | 次级表面悬停态 |
| `--border-subtle` | `Surface 0` | `#ccd0da` | `#313244` | 1px 结构细线、表格线、代码块外框 |
| `--border-rail-track` | `Surface 1` | `#bcc0cc` | `#45475a` | 左栏标尺导轨底轨线 |
| `--ink-primary` | `Text` | `#4c4f69` | `#cdd6f4` | 主标题与正文（7.06:1 / 11.34:1 AAA） |
| `--ink-secondary` | `Subtext 1` | `#5c5f77` | `#bac2de` | 副标题、摘要、左栏未激活目录项（5.53:1 / 9.26:1 AA+） |
| `--ink-muted` | `Subtext 0` | `#6c6f85` | `#a6adc8` | 日期/字数/阅读时长（**Latte 严禁用 `Overlay 0/1` 承载可读文本**） |
| `--ink-code-comment` | `Overlay 2` | `#7c7f93` | `#9399b2` | 代码注释（保障浅色可读性） |
| `--ink-line-num` | `Overlay 1` | `#8c8fa1` | `#7f849c` | 代码行号（纯装饰，不抢代码主体） |
| `--focus-ring` | `Lavender` | `#7287fd` | `#b4befe` | 键盘 `:focus-visible` 2px 聚焦环 |

### 2.2 Accent 与链接分工策略

- **默认主 Accent**：锁定 **`Mauve`**（`Latte #8839ef` 4.79:1 AA / `Mocha #cba6f7` 8.07:1 AAA），用于左栏标尺导轨游标、当前导航高亮与核心品牌交互。
- **顶栏极简化**：顶栏**不放取色器**，仅保留 `Latte / Mocha` 明暗切换按钮；通过 `window.THEME_CONFIG.accent` 支持 4 套精选 Catppuccin Accent：`mauve`（默认）、`blue`、`teal`、`lavender`（浅色文字态自动保障可读性）。
- **正文超链接**：采用 **`Blue`**（`#1e66f5` / `#89b4fa`）配合柔和下划线，与 `Mauve` 品牌导轨清晰区分。

### 2.3 代码块与引用/提示块配色

- **容器**：`Mantle` 代码底 + `Crust` 36px 精简顶栏（左侧语言名称、右侧复制按钮）+ `1px` `Surface 0` 边框；超过 34 行（可配置）默认折叠并附渐变遮罩展开按钮。
- **双引擎语法高亮**：同时覆写博客园 Highlight.js（`.hljs-*`）与 Prism（`.token.*`），完整映射 Catppuccin 官方 14 类 Syntax Token：
  - 关键字 `Mauve` · 函数 `Blue` · 字符串 `Green` · 数字/常量 `Peach` · 类型/类名 `Yellow` · 运算符 `Sky` · 参数 `Maroon` · 内置/宏 `Red` · 正则/转义 `Pink` · 属性 `Teal` · 注释 `Overlay 2` · 默认代码 `Text`。
- **引用块与语义提示块**：左侧 `3px` 语义色条（引用用主 Accent，Success 用 `Green`，Info 用 `Blue`，Tip 用 `Teal`，Warning 用 `Yellow`，Danger 用 `Red`）+ `Mantle` 或 8%–10% 柔和透明底 + `Text` 正文。

---

## 3. 排版体系与空间网格

### 3.1 字体栈与尺度

- **正文与标题**：`'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', sans-serif`（零中文字体包负担；默认优先命中本机字体，可选非阻塞 `font-display: swap`，绝不阻塞首帧闸门）。
- **等宽代码**：`'JetBrains Mono', 'Maple Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`。
- **阅读节奏**：正文 `16px`，行高 `1.75–1.78`；文章主标题 `31px`（移动端 `25px`），`H2` `22px`（上边距 `2.25em`，无底线），`H3` `18px`。

### 3.2 16:9 宽屏验证后的布局网格（`WF-06` 实图定版）

- **桌面端（`>= 960px`）**：
  - **居中工作台**：顶栏内部 `.ctp-nav-inner` 与主体 `#main` 统一约束为 **`max-width: 1360px; margin: 0 auto;`**，避免 16:9 / 超宽屏下内容偏左产生大面积死白。
  - **非对称两栏（去常驻右栏）**：`grid-template-columns: 264px minmax(0, 1fr)`。左侧 `264px` `Mantle` 导轨栏（`position: sticky; top: 52px`，左右带 `1px` `Surface 0` 细边界）；右侧 `Base` 主画布，文章内容区 **`max-width: 840px; margin: 0 auto;`**，首页列表区 **`max-width: 880px; margin: 0 auto;`**。
  - **隐藏原生右栏**：博客园 `#sideBar` 仅作为数据源提取公告、归档月份与分类，不再渲染为右侧卡片栏。
- **各页面左栏与组件摆放**：
  - **顶栏（`52px` `Crust`）**：左站点名（与左栏对齐）+ 紧邻主导航（首页 / 归档 / 分类 / 标签）+ 右侧明暗切换按钮。
  - **文章页**：左栏专注「标尺导轨自动目录（H1–H4）」，底部收拢桌面端「↑ 回到顶部 + 阅读百分比 + 细进度条」（取消桌面右下角悬浮球）；主画布依次为无卡片题头（H1 + 自然间距分组的日期/阅读时长/字数/分类/`Surface 0` 标签胶囊）→ 正文 → 左侧 `2px` 细竖线 + `Mantle` 平铺版权块 → 上下篇与评论区。
  - **首页 / 列表页**：左栏承接原博客公告/简介 + 本页文章快速索引；主画布顶部放置分类筛选条，下方为无阴影、无 hover 浮起的平铺条目列表（标题 + 两行摘要 + 元信息 + `1px` 细线分隔）。
  - **归档页 / 分类页 / 标签页**：归档页左栏为年月导轨索引、主画布为全站异步懒加载时间线；分类与标签页将博客园原生 `<table>` 重塑为平铺网格。
  - **续读记忆**：底部轻量 Toast（含「回到开头」动作按钮），5 秒自动消失或手动关闭。
- **移动端（`< 960px`）**：
  - 切为单栏全宽 `Base` 画布（强制 `flex-direction: column; align-items: stretch; max-width: 100%` 防宽代码块撑出横向滚动条）；
  - 顶栏导航折叠为右侧滑出抽屉；文章页左下角提供「目录」按钮拉起底部抽屉（Bottom Sheet），并显示简洁回到顶部按钮。
- **边缘页面与打印**：
  - 评论表单与楼层样式对齐 `Mantle` + `Surface 0` 细线体系；MathJax/KaTeX 继承 `--ink-primary`；
  - `@media print` 隐藏顶栏、左栏与抽屉，强制白底深字输出。

---

## 4. 博客园 DOM 硬约束与工程架构

一手源码审计详见 [cnblogs-theme-audit.md](./research/cnblogs-theme-audit.md)。

### 4.1 必须保留的 7 项底层硬约束

1. **免搬运侧栏控制**：利用博客园原生 DOM 结构与 CSS 隐藏/定位，不破坏 `#blog-sidecolumn` 异步 XHR 数据填充。
2. **首帧闸门与 `--ctp-field` 标记协议**：写在博客园「页面定制 CSS 代码」字段（render-blocking），托管模式 `--ctp-field:2`、内联备份 `--ctp-field:1`；严禁 `visibility: hidden`（防 `offsetParent === null` 导致目录提取失败），采用 `opacity: 0` + JS `1.5s` / CSS `2.5s` 双层超时兜底。
3. **跨文档 View Transition + 解析期静态顶栏**：`@view-transition { navigation: auto; }` 写在阻塞渲染的 CSS 字段中，顶栏设 `view-transition-name: ctp-nav` 且由页首 HTML 在解析期 `document.write` 预渲染静态结构，切页顶栏原地不动不白闪。
4. **首帧暗色预判**：页首最早同步按 `localStorage > THEME_CONFIG.defaultTheme > prefers-color-scheme` 写入 `html[data-theme="latte|mocha"]`。
5. **规避博客园 `<script src>` 自动 `defer` 改写**：通过内联 `<script>` + `document.write` 拆拼 `<scr`+`ipt>` 注入外链资源，且注释/字符串中不留未配对尖括号或完整 `</script>` 字面量。
6. **小时级缓存键 + 双源 CDN 熔断 + JS 内嵌 CSS 兜底**：主源 `cdn.jsdelivr.net` + 备源 `fastly.jsdelivr.net`（带 `?d=YYYYMMDDHH`），主源失败记入 `localStorage` 熔断 1 小时；CSS 双源全挂时由 `ctp-docs.js` 自动注入内嵌压缩 CSS。
7. **异步就绪状态机**：`MutationObserver` 监听 `#mainContent` 与 `#leftcontentcontainer` 就位后 `boot()`，对异步侧栏/分类/归档请求设帧上限后统一松闸。

### 4.2 源码目录结构（纯原生 + Python 3 零依赖构建）

```text
my-theme/
├── src/
│   ├── css/
│   │   ├── tokens.css           # Latte & Mocha 26色 + 语义 Token + 4 Accent
│   │   ├── critical.css         # --ctp-field:2 首帧闸门 + 52px顶栏骨架 + @view-transition
│   │   ├── layout.css           # 1360px 居中两栏工作台 + Reading Rail + 960px 响应式
│   │   ├── prose.css            # 正文、表格、引用/提示块、双引擎代码块、版权块
│   │   └── pages.css            # 首页列表、分类条、归档时间线、标签网格、评论区、打印
│   ├── js/
│   │   ├── core/                # 复用迁移：配置合并、首帧闸门、暗色状态、同日拆分、分页、图片懒加载
│   │   ├── data/                # 复用迁移：/categories 与 meta keywords 解析缓存、全站归档并发队列
│   │   └── ui/                  # 全新重写：顶栏接管、标尺目录、代码块壳、抽屉、Toast、公告/版权渲染
│   └── templates/
│       └── head-loader.html     # 页首模板（暗色预判 + 静态顶栏 + 双源 CDN 加载器）
├── scripts/                     # 纯 Python 3 合并、无损压缩、版本一致性校验与粘贴包生成
├── preview/                     # 博客园真实 DOM 离线快照与自动化检查/截图脚本
├── dist/
│   ├── ctp-docs.css / .min.css
│   ├── ctp-docs.js              # 全量运行包（含 CSS 双源失败内嵌兜底）
│   ├── paste/                   # 博客园后台粘贴包（样式.min.css + 页首.html）
│   └── fallback/                # 单文件完整内联备份（样式-内联备份.css，--ctp-field:1）
└── docs/                        # 本 Spec、调研报告与 Wayfinder 决策档案
```

### 4.3 轻配置契约（`window.THEME_CONFIG`）

```js
window.THEME_CONFIG = {
  siteName: '',                  // 留空自动取页面标题中的博客名
  accent: 'mauve',               // 'mauve' | 'blue' | 'teal' | 'lavender'
  defaultTheme: 'system',        // 'system' | 'latte' | 'mocha'
  nav: [
    { label: '首页', href: '/' },
    { label: '归档', href: '/p/archive/{ym}' },
    { label: '分类', href: '/categories' },
    { label: '标签', href: '/tag' }
  ],
  notice: { html: '' },          // 留空自动提取博客园后台公告原文
  categories: { show: true, include: [], max: 8 },
  code: { collapseLines: 34 },
  copyright: { show: true, license: 'CC BY-NC-SA 4.0' },
  resume: { show: true },
  favicon: ''
};
```

---

## 5. 本地预览与验收基线

1. **真实 DOM 离线快照**：在 `my-theme/preview/` 维护首页、文章页、归档页、标签页的博客园真实 DOM 快照，确保离线可一键预览与回归。
2. **自动化结构断言**：
   - `#sideBar` 不可见但公告/归档/分类数据提取完整；
   - 文章页左栏标尺导轨目录正常生成且 ScrollSpy 高亮唯一激活项；
   - 同日多篇 `.day` 正确拆分；Highlight.js 与 Prism 代码块高亮、复制与超长折叠正常，且跳过富文本 `.cnblogs_code`；
   - `< 960px` 视口下无任何水平溢出（`scrollWidth <= clientWidth`），抽屉可正常开关与 ESC 关闭。
3. **多视口视觉回归**：覆盖 `1440×900`、`1920×1080`、`390×844` 三种视口 × `Latte` / `Mocha` 双模式截图自检。

---

## 6. 建议实施里程碑（供后续编码阶段参考）

1. **M1 · 样式基础与构建骨架**：落地 `src/css/` 5 个样式模块与 `scripts/` Python 零依赖构建脚本（含 `--check` 版本门禁与双形态产物生成）。
2. **M2 · JS 核心复用与 UI 重写**：从只读参考迁移 `core/` 与 `data/` 模块，按本 Spec 重写 `ui/` 视图层（顶栏、Reading Rail 目录与底部进度、双引擎代码块、移动端抽屉、Toast）。
3. **M3 · 离线快照与视觉验收**：搭建 `preview/` 真实 DOM 快照与断言/截图脚本，在 `Latte` / `Mocha` 与三档视口下跑通全量自检，产出可直接粘贴到博客园后台的 `dist/paste/` 与 `dist/fallback/`。
