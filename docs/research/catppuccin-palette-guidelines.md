# Catppuccin `Latte` & `Mocha` 官方色板与语义映射规范调研

> **调研任务**：`WF-01`（[WF-01-catppuccin-palette-and-guidelines.md](../wayfinder/tickets/WF-01-catppuccin-palette-and-guidelines.md)）  
> **环境说明**：当前沙箱无外网连接（`raw.githubusercontent.com` / `catppuccin.com` DNS 不可解析）。本文色值与规范基于 Catppuccin 官方稳定版 v1.x 规范（`catppuccin/palette` `palette.json` 与 `catppuccin/catppuccin` `docs/style-guide.md`），所有中性灰阶已通过线性步进校验，所有 WCAG 2.1 对比度数值均由本地 Python 依据 W3C WCAG 2.1 相对亮度公式精确计算得出；建议上线或有外网环境时与官方仓库做一次快速 diff 复核。

**一手参考源（规范归属）**：
- 官方色板仓库：`https://github.com/catppuccin/palette`（`palette.json`）
- 官方设计规范：`https://github.com/catppuccin/catppuccin/blob/main/docs/style-guide.md`
- 官网色板页：`https://catppuccin.com/palette/`
- 对比度计算标准：W3C WCAG 2.1 Relative Luminance & Contrast Ratio（$L = 0.2126 R + 0.7152 G + 0.0722 B$，$CR = (L_1 + 0.05) / (L_2 + 0.05)$）

---

## 1. `Latte` 与 `Mocha` 完整 26 色精确 Hex 值

### 1.1 14 种强调色（Accent Colors）

| # | 名称 | Latte（浅色） | Mocha（暗色） | 典型色相定位 |
|---:|------|:---:|:---:|------|
| 1 | **Rosewater** | `#dc8a78` | `#f5e0dc` | 暖玫瑰金，常用于次级装饰/光标/柔和点缀 |
| 2 | **Flamingo** | `#dd7878` | `#f2cdcd` | 珊瑚粉红，常用于特殊符号/标点 |
| 3 | **Pink** | `#ea76cb` | `#f5c2e7` | 亮粉，常用于标签/转义字符 |
| 4 | **Mauve** | `#8839ef` | `#cba6f7` | Catppuccin 标志紫，官方最常用品牌 Accent & 关键字色 |
| 5 | **Red** | `#d20f39` | `#f38ba8` | 猩红/粉红，错误/删除/内置变量 |
| 6 | **Maroon** | `#e64553` | `#eba0ac` | 枣红，函数参数/次级错误 |
| 7 | **Peach** | `#fe640b` | `#fab387` | 暖橙，数字/常量/布尔值 |
| 8 | **Yellow** | `#df8e1d` | `#f9e2af` | 琥珀黄，类型/类名/警告 |
| 9 | **Green** | `#40a02b` | `#a6e3a1` | 翠绿，字符串/成功/新增 |
| 10 | **Teal** | `#179299` | `#94e2d5` | 青绿，提示/正则/特殊标识符 |
| 11 | **Sky** | `#04a5e5` | `#89dceb` | 天蓝，运算符/信息高亮 |
| 12 | **Sapphire** | `#209fb5` | `#74c7ec` | 蓝青，次级链接/信息/构造器 |
| 13 | **Blue** | `#1e66f5` | `#89b4fa` | 钴蓝，函数名/经典链接/信息状态 |
| 14 | **Lavender** | `#7287fd` | `#b4befe` | 薰衣草蓝紫，聚焦环/选中边框/属性名 |

### 1.2 12 种中性色（Monochromatic / Neutral Ramp）

| 分组 | 名称 | Latte（浅色） | Mocha（暗色） | 官方语义角色 |
|------|------|:---:|:---:|------|
| **Text** | **Text** | `#4c4f69` | `#cdd6f4` | 主正文、主标题（最高对比度文字） |
| **Text** | **Subtext 1** | `#5c5f77` | `#bac2de` | 副标题、正文次要段落、说明文字 |
| **Text** | **Subtext 0** | `#6c6f85` | `#a6adc8` | 标签文字、元信息、弱化标题 |
| **Overlay** | **Overlay 2** | `#7c7f93` | `#9399b2` | 代码注释（高可读档）、较清晰次级图标/标点 |
| **Overlay** | **Overlay 1** | `#8c8fa1` | `#7f849c` | 图标、次要元信息、非激活态文字 |
| **Overlay** | **Overlay 0** | `#9ca0b0` | `#6c7086` | 占位符、禁用态、代码注释（柔和档）、较深边框 |
| **Surface** | **Surface 2** | `#acb0be` | `#585b70` | 悬浮控件/强分割线/按钮 hover 底色 |
| **Surface** | **Surface 1** | `#bcc0cc` | `#45475a` | 次级表面边框、表格线、滚动条、行号背景 |
| **Surface** | **Surface 0** | `#ccd0da` | `#313244` | 表面元素底色（标签胶囊、输入控件、行内代码底、悬浮卡片） |
| **Background** | **Base** | `#eff1f5` | `#1e1e2e` | **主阅读背景**（正文区域、主画布） |
| **Background** | **Mantle** | `#e6e9ef` | `#181825` | **次级背景**（侧边栏、左栏目录、代码块底、页脚） |
| **Background** | **Crust** | `#dce0e8` | `#11111b` | **最深/最外层背景**（顶栏/外框/代码块头部/窗口边缘） |

---

## 2. 官方 Style Guide 语义层级约定

依据 `catppuccin/catppuccin` `docs/style-guide.md` 的核心设计原则：

### 2.1 三层背景哲学（Base / Mantle / Crust）
- **`Base` 永远是内容主角的画布**：用户视线停留最久的区域（文章正文、编辑器主区）使用 `Base`，不追求纯白 `#ffffff` 或纯黑 `#000000`，以温和的蓝灰/暖灰底色降低长文阅读疲劳。
- **`Mantle` 用于辅助与导航面板**：侧边栏、左栏目录、次级容器、代码块底色使用 `Mantle`，与 `Base` 的明度差非常克制（`Latte` 为 `1.08:1`，`Mocha` 为 `1.07:1`），靠微妙色阶分区而非厚重阴影。
- **`Crust` 用于框架边界与最深层容器**：最外层导航壳、分割区域底部、代码块顶栏或高对比度按钮上的反色文字（Mocha 中 `Crust` 是最深色，适合作为亮色 Accent 按钮上的文字色）。

### 2.2 表面与浮层（Surface 0–2 & Overlay 0–2）
- **`Surface 0` → `Surface 1` → `Surface 2`**：依次代表「默认交互表面 → 悬停/边框/分割线 → 激活/强边界」。
  - 典型用法：行内代码/标签胶囊默认底色 `Surface 0`，悬停 `Surface 1`，分割线 `Surface 0` 或 `Surface 1`，滚动条滑块 `Surface 1` / `Surface 2`。
- **`Overlay 0` → `Overlay 1` → `Overlay 2`**：用于「不抢正文风头的前景元素」（占位符、关闭按钮、代码注释、未激活的导航图标、禁用文字）。
  - ⚠️ **Latte 对比度警示**：下文计算表明，在 `Latte` 下 `Overlay 0`（`2.30:1`）和 `Overlay 1`（`2.83:1`）对 `Base` 均低于 `3.0:1`，因此**在浅色模式下不要把需要阅读的元信息或目录文字放在 `Overlay 0/1`**，至少使用 `Subtext 0`（`4.37:1`）或 `Subtext 1`（`5.53:1`）。

### 2.3 文本、链接、选中态与聚焦环
- **主标题与正文**：统一用 `Text`（`Latte` `7.06:1` AAA；`Mocha` `11.34:1` AAA）。
- **副标题与次要正文**：`Subtext 1`（`Latte` `5.53:1` AA；`Mocha` `9.26:1` AAA）。
- **元信息 / 日期 / 统计 / 目录未激活项**：`Subtext 0` 或 `Subtext 1`（若需严格 AA 正文，Latte 推荐 `Subtext 1`）。
- **链接**：官方推荐 `Blue` 或 `Sapphire`（或与站点主 Accent 一致，如 `Mauve`）；悬停时可配合下划线或色阶微调。
- **文本选中态（`::selection`）**：官方推荐使用 `Surface 2`（透明度 30%–50%）或 Accent 的 20%–30% 透明叠加，保证选中后 `Text` 依然清晰可读。
- **键盘聚焦环（`:focus-visible`）**：官方推荐 `Lavender` 或当前站点主 `Accent`（2px outline + offset）。

---

## 3. 14 种 Accent 的 WCAG 2.1 对比度精确评测

以下数据通过 Python 按 W3C WCAG 2.1 公式计算。重点关注 **`Latte` 下文字/链接可读性**（因为 `Mocha` 暗底上 14 种粉彩 Accent 全部达到 AAA >= 7.0:1，而 `Latte` 浅底上多数粉彩 Accent 对比度偏低）。

| Accent | Latte Hex | Latte vs Base | Latte AA 等级 | Latte vs Mantle | Mocha Hex | Mocha vs Base | Mocha AA 等级 | Mocha Crust-on-Accent |
|--------|:---:|---:|---|---:|:---:|---:|---|---:|
| **Red** | `#d20f39` | **4.80** | **AA 正文** | 4.46 | `#f38ba8` | 7.08 | AAA | 8.10 (AAA) |
| **Mauve** | `#8839ef` | **4.79** | **AA 正文** | 4.45 | `#cba6f7` | 8.07 | AAA | 9.23 (AAA) |
| **Blue** | `#1e66f5` | **4.34** | AA-Large/UI | 4.04 | `#89b4fa` | 7.79 | AAA | 8.91 (AAA) |
| **Maroon** | `#e64553` | 3.48 | AA-Large/UI | 3.23 | `#eba0ac` | 7.93 | AAA | 9.07 (AAA) |
| **Teal** | `#179299` | 3.31 | AA-Large/UI | 3.08 | `#94e2d5` | 11.01 | AAA | 12.59 (AAA) |
| **Green** | `#40a02b` | 2.96 | FAIL (<3.0) | 2.75 | `#a6e3a1` | 11.03 | AAA | 12.61 (AAA) |
| **Lavender** | `#7287fd` | 2.81 | FAIL (<3.0) | 2.62 | `#b4befe` | 9.17 | AAA | 10.48 (AAA) |
| **Sapphire** | `#209fb5` | 2.78 | FAIL (<3.0) | 2.58 | `#74c7ec` | 8.69 | AAA | 9.93 (AAA) |
| **Peach** | `#fe640b` | 2.64 | FAIL (<3.0) | 2.45 | `#fab387` | 9.27 | AAA | 10.59 (AAA) |
| **Flamingo** | `#dd7878` | 2.64 | FAIL (<3.0) | 2.46 | `#f2cdcd` | 11.24 | AAA | 12.85 (AAA) |
| **Sky** | `#04a5e5` | 2.47 | FAIL (<3.0) | 2.30 | `#89dceb` | 10.54 | AAA | 12.06 (AAA) |
| **Rosewater** | `#dc8a78` | 2.34 | FAIL (<3.0) | 2.17 | `#f5e0dc` | 12.95 | AAA | 14.80 (AAA) |
| **Pink** | `#ea76cb` | 2.34 | FAIL (<3.0) | 2.17 | `#f5c2e7` | 10.74 | AAA | 12.28 (AAA) |
| **Yellow** | `#df8e1d` | 2.31 | FAIL (<3.0) | 2.15 | `#f9e2af` | 12.91 | AAA | 14.76 (AAA) |

### 关键工程结论（供 WF-03 / WF-05 决策直接引用）
1. **`Mauve`（`#8839ef` / `#cba6f7`）是 Catppuccin 体系中极少数同时满足「标志性品牌辨识度 + Latte 正文 WCAG AA（4.79:1）+ Mocha AAA（8.07:1）」的 Accent**；`Red`（`4.80:1`）虽也达 AA，但因自带报错语义不适合做默认品牌色。
2. **`Blue`（`4.34:1`）、`Maroon`（`3.48:1`）、`Teal`（`3.31:1`）** 在 Latte 下满足非文本 UI 控件与大号字（>=3.0:1），但若直接用于 14–16px 小字链接，略低于 4.5:1。
3. **其余 9 种 Accent（如 `Peach`、`Green`、`Lavender`、`Sapphire`、`Sky`、`Yellow`、`Pink`）在 Latte `Base` 上均低于 `3.0:1`**：
   - 如果在浅色模式下把它们用作「装饰色条、图标、低饱和背景 tint（如 12% 透明底 + `Text` 文字）」完全安全；
   - 但**绝不能直接作为 Latte 正文链接色或白字实心按钮底色**，否则会造成明显的浅色可读性退化。若支持精选 Accent 切换，Latte 下应限定在 `Mauve` / `Blue` / `Teal`（或对文字态做明度加深/配 `Text` 前景）。
4. **中性文字对比度红线**：
   - `Latte` 下 `Text`（`7.06:1`）和 `Subtext 1`（`5.53:1`）在 `Base` 上稳过 AA；`Subtext 0`（`4.37:1`）接近 AA，仅建议用于辅助元信息；`Overlay 2`（`3.49:1`）仅用于大字/图标/弱注释；`Overlay 1/0` 不用于需要阅读的文本。
   - `Mocha` 下 `Text`（`11.34:1`）、`Subtext 1`（`9.26:1`）、`Subtext 0`（`7.37:1`）全部 AAA，`Overlay 2`（`5.81:1`）达 AA。

---

## 4. 代码语法高亮与 UI 状态色官方映射建议

### 4.1 官方 Syntax Highlighting 映射（源自 Catppuccin Style Guide）

| 语法 Token | 官方推荐色 | Latte Hex | Mocha Hex |
|------------|-----------|-----------|-----------|
| 关键字（Keywords: `if`, `return`, `const`, `class`） | **Mauve** | `#8839ef` | `#cba6f7` |
| 函数名 / 方法名（Functions / Methods） | **Blue** | `#1e66f5` | `#89b4fa` |
| 字符串 / 字符字面量（Strings） | **Green** | `#40a02b` | `#a6e3a1` |
| 数字 / 常量 / 布尔值（Numbers / Constants / Booleans） | **Peach** | `#fe640b` | `#fab387` |
| 类型 / 类名 / 接口（Types / Classes / Interfaces） | **Yellow** | `#df8e1d` | `#f9e2af` |
| 运算符（Operators） | **Sky** | `#04a5e5` | `#89dceb` |
| 参数（Parameters） | **Maroon** | `#e64553` | `#eba0ac` |
| 特殊内置 / 宏 / `this` / `self` | **Red** | `#d20f39` | `#f38ba8` |
| 正则 / 转义字符（Regex / Escape） | **Pink** | `#ea76cb` | `#f5c2e7` |
| 属性 / 字段（Properties / Attributes） | **Lavender** 或 **Teal** | `#7287fd` / `#179299` | `#b4befe` / `#94e2d5` |
| 注释（Comments） | **Overlay 2**（高可读）或 **Overlay 0**（柔和） | `#7c7f93` / `#9ca0b0` | `#9399b2` / `#6c7086` |
| 标点 / 括号（Punctuation / Brackets） | **Overlay 2** | `#7c7f93` | `#9399b2` |
| 默认标识符 / 普通代码（Variables / Plain） | **Text** | `#4c4f69` | `#cdd6f4` |
| 代码块背景 / 头部 / 行号 | **Mantle** / **Crust** / **Overlay 1** | `#e6e9ef` / `#dce0e8` / `#8c8fa1` | `#181825` / `#11111b` / `#7f849c` |

> **博客园代码块适配提示**：博客园文章里的代码块可能由 Highlight.js（`.hljs-*`）或 Prism 或自定义高亮渲染。映射到上述 Token 后，`Latte` 代码块底色用 `Mantle`（`#e6e9ef`）而非 `Crust`（`#dce0e8`），可为 `Green`/`Peach`/`Yellow` 等浅色语法色多保留约 10% 的对比度余量；注释建议选 `Overlay 2`（`3.25:1` vs `Mantle`），避免 `Overlay 0`（`2.14:1`）在浅色下发虚。

### 4.2 UI 语义状态色（Callout / 提示块 / Toast / Diff）

| 状态 | 官方语义色 | Latte Hex | Mocha Hex | 安全用法建议（兼顾 Latte 可读性） |
|------|-----------|-----------|-----------|------|
| **Success（成功 / 新增）** | **Green** | `#40a02b` | `#a6e3a1` | 左侧 3px 色条 + 10%–12% 透明底 + `Text` 正文 |
| **Info（提示 / 说明）** | **Blue** 或 **Sapphire** | `#1e66f5` / `#209fb5` | `#89b4fa` / `#74c7ec` | 左侧色条 + 柔和透明底 + `Text` 正文 |
| **Tip / Note（技巧 / 笔记）** | **Teal** | `#179299` | `#94e2d5` | 左侧色条 + 柔和透明底 + `Text` 正文 |
| **Warning（警告 / 注意）** | **Yellow** 或 **Peach** | `#df8e1d` / `#fe640b` | `#f9e2af` / `#fab387` | 务必用边框/图标承载颜色，标题与正文用 `Text` |
| **Danger / Error（错误 / 删除）** | **Red** | `#d20f39` | `#f38ba8` | Latte 下 `Red` 本身达 AA（4.80:1），可直接做文字与边框 |
