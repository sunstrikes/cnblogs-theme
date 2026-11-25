---
id: WF-05
title: 锁定 Catppuccin 语义 Token 映射、Accent 策略与代码块配色方案
parent: WF-MAP
labels:
  - wayfinder:grilling
status: closed
assignee: dev
blocked_by:
  - WF-01
  - WF-03
---

## Question

基于 [调研 Catppuccin Latte 与 Mocha 官方色板及语义映射规范](./WF-01-catppuccin-palette-and-guidelines.md) 的一手色板数据与 [确立视觉美学方向、排版体系与唯一视觉记忆点](./WF-03-visual-direction-typography-and-signature.md) 的视觉基调，锁定完整的色彩 Token 体系：

1. **表面与层级映射**：页面底色、内容区表面、侧栏/目录背景、浮层/抽屉、分割线与边框分别对应 Catppuccin `Latte` 与 `Mocha` 的哪一阶颜色？
2. **Accent 策略**：默认主强调色选 Catppuccin 14 色中的哪一个（如 Mauve / Lavender / Sapphire / Peach 等）？是否保留用户可切换的精选 Accent 集合，还是锁定单一品牌 Accent？
3. **语义色与代码块**：正文链接、标签胶囊、引用/提示块、状态反馈，以及行内代码与多行代码高亮（含行号、语言标识、折叠/复制控件）在 `Latte` 与 `Mocha` 下的具体映射与无障碍对比度兜底。

## Resolution

1. **默认主强调色与切换策略**
   - 默认主 Accent 锁定 **`Mauve`**（`Latte #8839ef` 4.79:1 AA / `Mocha #cba6f7` 8.07:1 AAA），专职承担左栏标尺导轨游标、当前导航高亮与关键品牌交互标识。
   - **顶栏不放取色器**，保持极简只留 `Latte / Mocha` 明暗切换按钮；通过 `window.THEME_CONFIG.accent` 支持 4 套精选高可读 Catppuccin Accent（`mauve` / `blue` / `teal` / `lavender`，其中浅色文字态对对比度偏低色值自动配 `Text` 前景或安全加深态）。
2. **链接色与品牌色分工**
   - 正文超链接采用 **`Blue`**（`Latte #1e66f5` / `Mocha #89b4fa`）配合克制下划线，与左栏导轨和品牌交互的 `Mauve` 形成清晰功能分工。
3. **双模式语义 Token 映射（严格遵守 Latte 无障碍红线）**
   - `--bg-canvas`：`Base`（`#eff1f5` / `#1e1e2e`）主阅读画布
   - `--bg-rail` / `--bg-code`：`Mantle`（`#e6e9ef` / `#181825`）左栏导轨、代码块底、版权块与抽屉
   - `--bg-chrome` / `--bg-code-head`：`Crust`（`#dce0e8` / `#11111b`）52px 顶栏壳层与代码块顶栏
   - `--bg-subtle`：`Surface 0`（`#ccd0da` / `#313244`）行内代码底、标签胶囊、分类筛选默认态
   - `--border-subtle`：`Surface 0`（`#ccd0da` / `#313244`）1px 结构细线、表格线、代码块外框
   - `--border-rail-track`：`Surface 1`（`#bcc0cc` / `#45475a`）左栏导轨底轨线
   - `--ink-primary`：`Text`（`#4c4f69` / `#cdd6f4`）主标题与正文
   - `--ink-secondary`：`Subtext 1`（`#5c5f77` / `#bac2de`）副标题、摘要、未激活目录项
   - `--ink-muted`：`Subtext 0`（`#6c6f85` / `#a6adc8`）日期/字数/时长等次级元信息（禁用 Latte `Overlay 0/1` 承载可读文本）
   - `--focus-ring`：`Lavender`（`#7287fd` / `#b4befe`）键盘 2px `:focus-visible` 聚焦环
4. **代码块与引用/提示块规范**
   - 代码块采用 `Mantle` 底 + `Crust` 精简顶栏（左语言名、右复制按钮）+ `1px` `Surface 0` 外框；>34 行自动折叠并附渐变展开；行号用 `Overlay 1`。
   - 完整映射 Catppuccin 官方 14 类 Syntax Token（关键字 `Mauve`、函数 `Blue`、字符串 `Green`、数字/常量 `Peach`、类型 `Yellow`、运算符 `Sky`、参数 `Maroon`、内置 `Red`、正则 `Pink`、属性 `Teal`、注释 `Overlay 2`），同时覆写 Highlight.js（`.hljs-*`）与 Prism（`.token.*`）双引擎。
   - 引用块与语义提示块（Success/Info/Tip/Warning/Danger）采用左侧 `3px` 语义色条 + `Mantle`/柔和透明底 + `Text` 正文，保障浅色高可读。
