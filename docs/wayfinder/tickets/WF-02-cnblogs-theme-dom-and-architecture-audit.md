---
id: WF-02
title: 拆解 cnblogs-document-theme 的 DOM 契约、CSS 机制与 JS 模块边界
parent: WF-MAP
labels:
  - wayfinder:research
status: closed
assignee: research-agent
blocked_by: []
---

## Question

对只读参考仓库 `cnblogs-document-theme/` 进行一手源码拆解，明确以下事实：

1. **博客园真实 DOM 契约**：首页、文章页、归档页、分类页、标签页的真实 DOM 结构与关键选择器，以及哪些 CSS 技巧属于不可破坏的硬约束（如 `#sideBar{display:contents}`、首帧闸门 `--qb-field`、跨文档 View Transition 静态顶栏、小时级缓存键、首帧暗色预判）。
2. **JS 模块盘点**：`dist/document-theme.js`（或 `snippets/footer-script-v7.html`）包含哪些功能模块？哪些模块是纯 DOM 数据提取/增强（易于直接复用），哪些与原有三栏卡片 DOM/CSS 类名强耦合（需要重构或解耦）？
3. **构建与验证体系**：`_dev-tools/` 下的打包脚本（`gen-deploy.py`、`gen-bundle.py`、`gen-min.py` 等）与 `preview/` 快照、`verify-*.js` 校验脚本是如何运作的？新主题复用这套本地预览与自动化验收思路的最小必要依赖是什么？

调研结果输出至 `my-theme/docs/research/cnblogs-theme-audit.md`，精确引用源码文件路径与行号。

## Resolution

已完成对只读仓库 `cnblogs-document-theme/`（`v7.39`）的一手源码审计，完整报告见 [cnblogs-theme-audit.md](../../research/cnblogs-theme-audit.md)。核心结论：

1. **博客园 DOM 契约与 7 项底层硬约束**：明确了首页/文章页/归档页/分类页/标签页/评论区/代码块的真实 DOM 选择器与关键陷阱（无 `#rightColumn`、`#leftcontentcontainer` 实为右栏容器、文章页无 `#EntryTag`/`#BlogPostCategory` 需靠 `meta[name="keywords"]` + `/categories` 核对），并锁定 7 项必须保留的底层机制（`#sideBar{display:contents}`、首帧闸门 `--qb-field` + 不可用 `visibility:hidden`、render-blocking View Transition + `document.write` 预渲染顶栏、首帧暗色预判、小时级缓存键 + 双源 CDN 熔断 + JS 内嵌 CSS 兜底、`MutationObserver` 抢帧启动与 `settle` 等异步侧栏）。
2. **JS 模块复用边界**：拆解了 `footer-script-v7.html` 全部 19 个功能模块。约 65% 的数据层、缓存层与博客园 DOM 清洗逻辑（配置合并、同日多篇拆分、分页增强、代码块交互、暗色优先级、文章字数/锚点计算、分类/标签抓取与缓存、全站归档队列、宽表处理、续读记忆）低耦合可直接复用；顶栏、公告、面板壳、强调色取色器与移动端抽屉的渲染层则按 `ctp-docs` 新视觉重写。
3. **双形态构建与本地验收最小依赖**：梳理了纯 Python 3 零依赖构建链（CSS/JS 压缩 → 合并包 → `paste/` 托管粘贴包 + `fallback/` 全量内联备份）与基于 `preview/` 真实 DOM 快照的离线验证模式；确认当前环境已具备 `Node v24.18.0`、`Python 3.14.10` 及 `/root/venv/bin/playwright`，可直接搭建离线快照预览与多视口截图自检闭环。
