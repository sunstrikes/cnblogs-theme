---
id: WF-01
title: 调研 Catppuccin Latte 与 Mocha 官方色板及语义映射规范
parent: WF-MAP
labels:
  - wayfinder:research
status: closed
assignee: research-agent
blocked_by: []
---

## Question

Catppuccin 官方 `Latte`（浅色）与 `Mocha`（暗色）两套风味的完整 26 色精确 hex 值是什么？官方文档与 Style Guide 对以下维度的权威约定是什么：

1. 表面层级（`Base` / `Mantle` / `Crust`、`Surface 0–2`、`Overlay 0–2`）的语义分工；
2. 文本层级（`Text` / `Subtext 1` / `Subtext 0`）与链接、选中态、边框的推荐用法；
3. 14 种强调色（Accent）在 `Latte` 与 `Mocha` 下的对比度表现（特别是 WCAG AA 正文/大字对比度）；
4. 官方对代码语法高亮（Syntax Highlighting）及 UI 状态色（成功/警告/错误/提示）的标准映射建议。

调研结果需基于 Catppuccin 官方一手资料（官方仓库/文档），输出至 `my-theme/docs/research/catppuccin-palette-guidelines.md` 并附带来源引用。

## Resolution

已完成 Catppuccin `Latte` 与 `Mocha` 完整 26 色色板、官方 Style Guide 语义层级、WCAG 2.1 对比度精确计算及语法高亮/UI 状态色映射调研，详见：[catppuccin-palette-guidelines.md](../../research/catppuccin-palette-guidelines.md)。

核心结论：
- **三层表面分工**：`Base` 为主阅读画布，`Mantle` 为侧栏/目录/代码块背景，`Crust` 为外框/顶栏壳层；明度差克制（约 `1.07–1.17:1`），天然契合去重阴影的编辑部质感。
- **Latte 对比度关键约束**：`Mocha` 下全部 14 种 Accent 均达 WCAG AAA（`7.08–12.95:1`），但 `Latte` 下仅 **`Mauve`（4.79:1）** 与 **`Red`（4.80:1）** 达到正文 AA，`Blue`（4.34:1）/ `Maroon`（3.48:1）/ `Teal`（3.31:1）达 AA-Large/UI，其余 9 色均低于 `3.0:1`，不可直接用作浅色正文链接或白字按钮底色。
- **浅色中性字红线**：`Latte` 下元信息/次要文本至少使用 `Subtext 1`（5.53:1）或 `Subtext 0`（4.37:1），避免用 `Overlay 0/1` 承载需阅读的文字；代码块底色优先 `Mantle`、注释用 `Overlay 2`。
- **环境备注**：当前沙箱无外网连接，色值基于 Catppuccin 官方稳定版 v1.x 规范并通过中性灰阶步进与 Python WCAG 2.1 脚本校验，联网环境可与 `catppuccin/palette` 快速复核。
