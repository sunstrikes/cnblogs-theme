# 博客园 Custom 皮肤的离线样本

这些样本保留公开博客 `https://www.cnblogs.com/sunstrikes` 在 2026-11-25 返回的原生 DOM 结构，作者、文章内容、计数与链接均换成本地示例。取样用于识别平台接口，不复用该博客的主题、脚本或文章。`preview/site.py` 提供路由并插入定制字段；`preview/fixtures/async.js` 在首屏渲染后分别填入平台响应。运行回归不需要访问博客园。

| 场景 | 本地路径（相对于 `/sample`） | 保留的结构与行为 |
| --- | --- | --- |
| 首页与翻页 | `/`、`?page=2` | 一组 `.day` 可有多篇；`.postTitle`、`.postCon`、`.postDesc` 是兄弟节点，文章之间有 `.postSeparator`。|
| 文章 | `/p/1001`、`/p/1002`、`/p/1003.html`、`/p/1004` | 标题 `#cb_post_title_url` 与 `#cnblogs_post_body` 随首屏返回；分类和标签可晚到。|
| 分类目录与结果 | `/categories`、`/post-categories`、`/category/21.html`、`/category/22.html` | `.category-list-item a` 的文本包含计数；结果中的 `.entrylistItemTitle` 可打开新标签页。|
| 标签目录与结果 | `/tag/`、`/tag/排版/`、`/tag/间距/` | `#MyTag1_dtTagList td[data-use-count]` 中的计数与链接并列；结果链接位于 `#myposts .postTitl2`。|
| 月份归档 | `/p/archive/2025/06`、`/p/archive/2025/05` | 每月返回含 `.entrylist` 的完整 HTML。取样时，归档根路径和没有文章的当月均返回 404；有文章的月份见 `#sidebar_postarchive`。|

`/sample/ajax/news` 返回 HTML。`#sidebar_news_content` 是公告，`#profile_block` 是相邻的个人资料。`/sample/ajax/sidebar-lists` 返回 JSON；`sideColumn` 与 `topLists` 均为 HTML 字符串。

`/sample/ajax/post-accessories?postId=1001` 返回 JSON。`categoriesTags` 前插到 `#blog_post_info_block`，其中 `#BlogPostCategory` 和 `#EntryTag` 分别提供文章分类和标签，`#BlogCollection` 不属于二者。平台将 `postInfo`、`prevNext` 填入各自占位符，并用 `postStats` 更新计数。`/sample/ajax/comments-block` 的 `comments` 和 `commentForm` 则填入评论区与表单区。样本模拟匿名、零评论状态，不模拟登录或提交。
