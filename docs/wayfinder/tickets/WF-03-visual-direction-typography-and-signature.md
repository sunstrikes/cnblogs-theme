---
id: WF-03
title: 确立视觉美学方向、排版体系与唯一视觉记忆点
parent: WF-MAP
labels:
  - wayfinder:grilling
status: closed
assignee: dev
blocked_by:
  - WF-01
---

## Question

遵循 `SKILL.md`（`frontend-design`）的「两轮设计评审」与「克制 + 单一视觉记忆点」原则，面向「开发者深度技术博客 / 数字花园」这一题材，拍板 `ctp-docs` 的核心视觉人格：

1. **视觉气质与反模板化边界**：明确如何避开通用 SaaS 卡片风、暖米色 Anthropic 默认风、高频 AI 装饰元素（如无意义 ALL-CAPS eyebrow、圆点拼接元信息、到处挂阴影卡片）。
2. **字体与排版比例**：确定正文、标题、代码（等宽）的字体组合（中英文混排 + 代码字体），以及字阶、正文行宽（< 80 字符）、行高与字重策略。
3. **唯一的大胆视觉记忆点（One bold memorable thing）**：在全站保持克制阅读体验的前提下，哪一个元素承担视觉辨识度（例如文章 Hero/标题排版、目录导航器形态、代码块/引用块特征、或特定的 Catppuccin 色彩结构运用）？

## Resolution

1. **视觉表面哲学：连续画布 + Catppuccin 三阶平面分层**
   - 彻底告别原版「灰底 + 浮空圆角白卡 + 阴影」的通用 SaaS 卡片形态。
   - 正文主画布铺于 `Base`，左栏目录与代码块落在 `Mantle`，顶栏与壳层落在 `Crust`；全局无重阴影，仅在必要结构边界处使用 `1px` `Surface 0/1` 细线表达层次。
2. **字体组合与排版尺度**
   - **字体栈**：现代人文无衬线 + 等宽代码，零中文字体包负担。
     - 正文/标题：`'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', sans-serif`（拉丁/数字轻量 Web 字体加载与首帧策略待后续性能预算细化，确保系统无衬线即时可读）。
     - 代码/等宽：`'JetBrains Mono', 'Maple Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`。
   - **阅读尺度**：正文行宽严格控制在 `66–74ch`（满足 `< 80` 字符规范），正文行高 `1.75–1.8`，标题与正文形成明确字阶对比，不做标题内单词高亮。
3. **全站唯一视觉记忆点：左栏「标尺导轨式」自动目录（Reading Rail）**
   - 将必须保留的左栏自动目录打磨为全站视觉锚点：极细纵向轨道 + 当前阅读章节的高对比度指示游标 + 清晰层级缩进，传达「面向精读的开发者文档工作台」气质。
   - 其余区域（文章开篇、元信息、代码块、页脚）保持克制与安静，代码块确保高完成度 Catppuccin 原生语法高亮但不喧宾夺主。
4. **反模板化硬性验收红线（源自 `SKILL.md`）**
   - 禁用无意义的 ALL-CAPS 小眉标（eyebrow）与非序列内容的 `01 / 02 / 03` 装饰编号；
   - 禁用机械的 `A · B · C` 中点串联元信息与链接/按钮尾部统一的 `→` 装饰箭头；
   - 禁用全局 hover 卡片浮起与段落淡入上滑入场动画（动效仅用于响应用户明确交互：抽屉展开、目录游标追踪、复制成功反馈）。
