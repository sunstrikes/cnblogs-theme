---
id: WF-MAP
title: ctp-docs · 基于 Catppuccin 的博客园主题设计方案
labels:
  - wayfinder:map
status: closed
---

# ctp-docs · 基于 Catppuccin 的博客园主题设计方案

## Destination

产出一份完整、可直接进入编码实施的 `ctp-docs` 博客园主题设计方案与技术规格（Spec）：以 `cnblogs-document-theme` 为只读技术参考（复用其博客园真实 DOM 适配经验与核心交互能力），按照 `frontend-design`（`SKILL.md`）原则完成深度视觉重塑，对齐 Catppuccin `Latte` + `Mocha` 双模式配色体系，明确页面信息架构、组件摆放、轻配置契约、双形态（CDN 托管 + 内联备份）构建分发与基于真实 DOM 快照的视觉验收闭环。

## Notes

- **主工作目录**：`my-theme/`（`cnblogs-document-theme/` 全程只读参考，不修改其中任何文件）。
- **主题暂定代号**：`ctp-docs`（后续可随时更名）。
- **内容与受众定位**：面向开发者的个人深度技术博客 / 数字花园，高频长文阅读、代码块与表格展示，追求克制、温暖、有编辑部质感的阅读体验。
- **硬性约束**：
  - 左栏自动目录必须保留；其余交互模块（导航、公告、分类筛选、文章元信息、版权块、续读记忆、暗色/强调色入口等）可自由重新设计摆放方式。
  - 配色范围锁定 Catppuccin `Latte`（浅色）+ `Mocha`（暗色）双模式。
  - 保留轻量配置层（`window.THEME_CONFIG`）与个人默认配置解耦。
  - 交付形态覆盖「自托管双源 CDN 轻量粘贴」为主 + 「单文件内联备份」兜底。
  - 必须包含基于真实博客园 DOM 快照的本地预览与截图自检闭环。
- **每次会话必读技能与参考**：
  - 项目根目录 `SKILL.md`（`frontend-design`：两轮设计评审、反 AI 模板化、克制与单一视觉记忆点）
  - `grilling` 与 `domain-modeling`（HITL 决策时使用）
  - `prototype`（原型验证 ticket 使用）
- **Tracker 约定**：当前仓库无远端 Issue Tracker，采用本地 Markdown Tracker，所有 ticket 存放于 `my-theme/docs/wayfinder/tickets/`。

## Decisions so far

<!-- one line per closed ticket, linking to the ticket that holds the full resolution -->

- [调研 Catppuccin Latte 与 Mocha 官方色板及语义映射规范](./tickets/WF-01-catppuccin-palette-and-guidelines.md)：锁定 Latte/Mocha 完整 26 色与三层表面分工（Base/Mantle/Crust）；WCAG 实测 Mocha 14 色全 AAA，而 Latte 仅 Mauve/Red 达正文 AA（Blue/Maroon/Teal 达大字 AA），为后续 Accent 与语义色选型划定无障碍红线。
- [拆解 cnblogs-document-theme 的 DOM 契约、CSS 机制与 JS 模块边界](./tickets/WF-02-cnblogs-theme-dom-and-architecture-audit.md)：盘点 6 类博客园真实 DOM 选择器与 7 项不可破坏的底层机制（display:contents、--qb-field 首帧闸门、静态顶栏 View Transition、小时级缓存与双源回退等），确认约 65% 的 JS 数据/增强逻辑可低耦合复用，并梳理出零依赖 Python 构建与 Playwright 本地快照验收基线。
- [确立视觉美学方向、排版体系与唯一视觉记忆点](./tickets/WF-03-visual-direction-typography-and-signature.md)：确立「连续画布 + Base/Mantle/Crust 三阶平面分层」无阴影美学、现代人文无衬线 + 等宽代码（66–74ch / 行高 1.75–1.8）、以左栏「标尺导轨式」自动目录（Reading Rail）作为全站唯一视觉记忆点，并锁定 4 项反模板化验收红线。
- [确定页面信息架构、布局形态与交互组件摆放方案](./tickets/WF-04-layout-ia-and-component-placement.md)：锁定桌面端（>=960px）非对称两栏阅读工作台（240–260px Mantle 左栏导轨 + Base 主画布左对齐留白、去常驻右栏），52px Crust 静态预渲染顶栏，桌面回到顶部与进度收拢至左栏底部，移动端（<960px）单栏 + 右侧导航抽屉 + 底部目录抽屉。
- [锁定 Catppuccin 语义 Token 映射、Accent 策略与代码块配色方案](./tickets/WF-05-catppuccin-tokens-accent-and-code-theme.md)：默认主 Accent 锁定 Mauve（顶栏不放取色器，通过 THEME_CONFIG.accent 支持 4 套精选色），正文链接用 Blue + 克制下划线，完整落地 Base/Mantle/Crust/Surface/Text 语义 Token（Latte 禁 Overlay 0/1 可读文本），代码块同时覆写 Highlight.js 与 Prism 双引擎（注释用 Overlay 2）。
- [用静态视觉原型验证首页与文章页布局及明暗观感](./tickets/WF-06-static-visual-prototype-and-critique.md)：完成静态原型与 16:9 实图检视，固化 4 项减法（激活目录去底块只留标尺游标、去 H2 底线、版权块改左细线、去中点文案），并将桌面布局修订锁定为 1360px 居中工作台 + 840px 文章区 / 880px 列表区。
- [确定 JS 复用边界、配置契约、构建产物与验收基线](./tickets/WF-07-js-boundary-config-build-and-verification.md)：锁定原生 CSS/JS + 纯 Python 3 零依赖目录结构、`window.THEME_CONFIG` 轻配置契约、双源 CDN + 内联备份分发机制、真实 DOM 快照验收闭环，以及字体/评论/公式/打印边缘策略，最终汇交 `my-theme/docs/DESIGN-SPEC.md`。

## Not yet specified

<!-- 已全部收敛清零，无遗留迷雾；详见最终交付规格 my-theme/docs/DESIGN-SPEC.md -->

## Out of scope

- **生产代码编写与线上部署**：本张地图只负责收敛设计与技术 Spec，不包含 `my-theme/` 完整主题代码实施与博客园线上发布。
- **Catppuccin `Frappé` 与 `Macchiato` 风味**：首期锁定 `Latte` + `Mocha` 双模式，其余暗色风味不纳入本次方案。
- **修改 `cnblogs-document-theme/`**：上游参考仓库全程只读。
- **博客园非 `Custom` 皮肤兼容**：仅面向 `Custom（自定义）` 皮肤。
