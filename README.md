# CTP Docs · 博客园阅读主题

在博客园 `Custom` 皮肤上，CTP Docs 把文章目录放在正文左侧，手机上通过「目录」按钮打开。先用[文章页截图](preview/screenshots/post-latte-1440x900.png)看效果；也可以从仓库根目录运行 `python3 preview/serve.py --open`，直接用本地产物翻页。

## 1. 生成自己的发布包（本地）

安装本仓库的主题可直接使用 [`dist/paste/`](dist/paste/) 中的两个文件，跳到下一节。页首从 `sunstrikes/cnblogs-theme` 的版本标签加载资源；运行 `python3 scripts/build.py --check` 可核对本地文件。

如果你要从自己的公开仓库分发，构建只需 Python 3 标准库。把下面的 `OWNER/REPO` 改成你的仓库，`REF` 改成准备发布的新标签（不含 `/`）。在主题根目录运行：

```sh
REPO='OWNER/REPO'
REF='v1.1.0'
python3 scripts/build.py --repo "$REPO" --ref "$REF" --version 1.1.0
python3 scripts/build.py --repo "$REPO" --ref "$REF" --version 1.1.0 --check
```

[`--check`](scripts/build.py) 逐字节比较产物，不写入文件。`--version` 校验 CSS 和 JS 源码中的版本，`--ref` 决定两个 CDN 地址指向的 Git 版本。其他输出目录可用 `--out` 指定。版本不符或产物改动时，先核对参数并重新生成，再发布。

## 2. 安装到博客园（博主手动操作）

以下步骤需博主登录博客园后台操作。先确认资源可访问，再替换后台字段：

1. 使用自有仓库时，先将生成的 `dist/` 随版本标签推送到 GitHub。打开 `dist/paste/页首.html`，在两个 `…/dist/` 地址后分别补上 `ctp-docs.min.css` 和 `ctp-docs.js`，检查返回的是文件内容。
2. 备份当前皮肤、定制 CSS、页首和页脚 HTML。换用 `Custom` 皮肤，确认博客可以运行自定义 JavaScript；移除旧主题的脚本，保留无关内容。
3. 把 `dist/paste/样式.min.css` 全文粘到 **页面定制 CSS 代码**，不加 `<style>` 标签。
4. 把 `dist/paste/页首.html` 全文粘到 **页首 HTML 代码**。保存设置。本主题无需另贴页脚脚本。
5. 打开有小标题的文章。宽屏应显示左栏目录；点顶栏的 Latte 或 Mocha 按钮后刷新，主题应保留。浏览器网络面板应看到主题 CSS、JS 请求，地址中含你的仓库和 Git 版本。

如需指定站名或配色，把配置放在页首粘贴内容**之前**，例如 `<script>window.THEME_CONFIG = {siteName: '纸页手记', accent: 'teal'}</script>`。不填时跟随系统明暗，读者自己的选择优先。其余字段见[设计规格](docs/DESIGN-SPEC.md) §4.3。

### 代码高亮

在博客园后台选择 `prismjs` 或 `highlight.js`，**取消勾选「禁用默认代码高亮」**。博客园负责识别语言和语法，主题按 [Prism 配色定义](https://github.com/catppuccin/prismjs/blob/d5cddefcc6f2190f5396d56b42f1f0927d64f6bb/prismjs.tera) 或 [Highlight.js 配色定义](https://github.com/catppuccin/highlightjs/blob/79a8accb89c5a94010ed3968cb2b04c3d679b6ba/sass/_theme.scss) 着色。两种引擎的角色和颜色不完全相同；切换 Latte / Mocha 不需要重新渲染代码。

主题还会把 Python 代码中 `F.softmax(x)` 的 `softmax` 标成函数色，字符串、注释和未调用的 `F.softmax` 不变。无需另贴页脚脚本；从旧版升级时可以移除先前单独添加的 Python 方法着色脚本。未标注语言或引擎未识别的内容不保证有语法色。

### 正文图片的延迟加载

要让屏外图片等到读者接近时再下载，写文章时使用 `<img loading="lazy" src="图片地址" alt="图注">`。这种写法不依赖主题脚本。主题也支持只有 `data-src` 而没有 `src` 的图片，脚本加载后才会设置图片地址。博客园编辑器若只输出普通的 `<img src="…">`，浏览器可能在主题运行前就发出请求，脚本无法撤回。

## 样式加载失败或需要回滚

主源出错后，加载器尝试备用地址，接下来一小时内优先使用备源。资源 URL 的 `?d=YYYYMMDDHH` 按 UTC 小时更新。两个 CSS 地址都失败但 JS 可用时，脚本会插入包内样式。相关场景可由[断网测试](preview/test_package.py)重现。

要避开外部 CSS，把 **页面定制 CSS 代码** 整段替换为 `dist/fallback/样式-内联备份.css`，保留当前页首并刷新。此时网络面板不应再出现 `ctp-docs.min.css`；目录、复制等交互仍需 JS。要撤销整个主题，恢复备份的皮肤和后台各字段。

## 离线验收（本地）

构建与预览服务无需第三方包。浏览器测试另需 Chromium、pytest 和 Playwright，本仓库使用的测试版本见 [`preview/requirements.txt`](preview/requirements.txt)。首次联网准备测试环境后，测试期间无需访问博客园或 CDN：

```sh
python3 -m venv /tmp/ctp-docs-venv
. /tmp/ctp-docs-venv/bin/activate
python -m pip install -r preview/requirements.txt
python -m playwright install chromium
python -m pytest -q preview
```

已有兼容的 Chromium 时，可用 `CTP_CHROMIUM` 指定可执行文件路径，跳过浏览器下载。[页面样本](preview/fixtures/README.md)保留平台 DOM 和异步响应的结构。浏览器测试原样读取粘贴字段，拦截两个 CDN 地址并返回本地文件；手动预览和跨页 View Transition 测试仅将这两个地址的域名映射到回环服务。

[24 张截图](preview/screenshots/)覆盖首页、文章、月份归档、标签目录；每页保留三档视口的 Latte 与 Mocha。安装中文系统字体后，在同一测试环境另存一份用来对照：

```sh
python -m pytest -q preview/test_visual.py -k release_viewport --screenshots=/tmp/ctp-shots
```
