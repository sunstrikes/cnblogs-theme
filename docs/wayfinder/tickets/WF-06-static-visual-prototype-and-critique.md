---
id: WF-06
title: 用静态视觉原型验证首页与文章页布局及明暗观感
parent: WF-MAP
labels:
  - wayfinder:prototype
status: closed
assignee: dev
blocked_by:
  - WF-04
  - WF-05
---

## Question

将已拍板的视觉体系、布局方案与 Catppuccin `Latte`/`Mocha` Token 制作成基于博客园真实 DOM 快照的低成本静态 HTML/CSS 原型（覆盖首页与文章页、明暗双模式及移动端断点），并通过实际渲染与截图对照 `SKILL.md` 进行 Pass 2 自我批判：

1. 哪些视觉细节仍显得像模板或过度装饰，需要做减法（Chanel 原则：拿掉一件多余配饰）？
2. 信息层级、留白节奏、左栏目录可读性与代码块对比度在真实长文内容下是否成立？
3. 根据原型评审反馈修订设计 Token 与布局规范，锁定最终视觉基线。

## Resolution

- **原型资产**：[my-theme/prototype/index.html](../../prototype/index.html)、[my-theme/prototype/prototype.css](../../prototype/prototype.css)、[my-theme/prototype/capture.py](../../prototype/capture.py)（一次性验证原型，覆盖首页/文章页与 Latte/Mocha 切换）。
- **Pass 2 自我批判减法（4 项固化）**：
  1. 左栏激活目录项去掉淡色背景块，仅保留 `3px` `Mauve` 标尺游标 + 加粗强调色文字，强化 Reading Rail 唯一视觉锚点；
  2. 去掉正文 `H2` 下方全宽 `1px` 底线，改用充裕上留白（`2.25em`）自然分隔章节；
  3. 文末版权块取消四边圆角外框，改为与引用块同源的 `2px` 左侧细竖线 + `Mantle` 柔和底；
  4. 清除顶栏品牌、明暗切换按钮与版权块中残留的 `·` 中点拼接，统一采用简洁短语与主动动词。
- **16:9 宽屏实图验证与布局修订（覆盖更新 `WF-04` 桌面宽度尺度）**：
  - 实图暴露纯 `70ch`（~600px）且双栏贴最左侧在 16:9 宽屏下右侧出现大片失衡空白；
  - **最终锁定尺度**：顶栏内部 `.ctp-nav-inner` 与 `#main` 采用 **`max-width: 1360px; margin: 0 auto;`** 居中工作台（左栏 `264px` 两侧带 `1px` `Surface 0` 细边界）；文章正文区放宽至 **`max-width: 840px; margin: 0 auto;`**，首页列表区 **`max-width: 880px; margin: 0 auto;`**，兼顾中文阅读节奏、代码块/宽表格可读性与 16:9 屏幕利用率。
