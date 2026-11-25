// Replay native read-only requests independently: news never gates posts or sidebar lists.
(() => {
  const $ = id => document.getElementById(id);
  async function load(endpoint, type, insert) {
    try {
      const response = await fetch('/sample/ajax/' + endpoint);
      if (response.ok) insert(await response[type]());
    } catch (_) { /* A missing platform response leaves the original document readable. */ }
  }
  if ($('sidebar_news_container')) load('news', 'text', html => { $('sidebar_news_container').innerHTML = html; });
  if ($('blog-sidecolumn')) load('sidebar-lists', 'json', ({sideColumn, topLists}) => {
    $('blog-sidecolumn').innerHTML = sideColumn;
    const recent = $('sidebar_recentcomments');
    if (recent) recent.insertAdjacentHTML('beforebegin', topLists);
    else $('blog-sidecolumn').insertAdjacentHTML('beforeend', topLists);
  });
  if ($('cb_post_title_url')?.pathname === '/sample/p/1001') {
    load('post-accessories?postId=1001', 'json', ({categoriesTags, prevNext, postInfo, postStats}) => {
      $('blog_post_info_block')?.insertAdjacentHTML('afterbegin', categoriesTags);
      if ($('post_next_prev')) $('post_next_prev').innerHTML = prevNext;
      if ($('blog_post_info')) $('blog_post_info').innerHTML = postInfo;
      if ($('post_view_count')) $('post_view_count').textContent = postStats.viewCount;
      if ($('post_comment_count')) $('post_comment_count').textContent = postStats.feedbackCount;
    });
    load('comments-block?postId=1001&anchorCommentId=0&isDesc=false&order=0&loadCommentBox=true', 'json', ({comments, commentForm}) => {
      if ($('blog-comments-placeholder')) $('blog-comments-placeholder').innerHTML = comments;
      if ($('comment_form_container')) $('comment_form_container').innerHTML = commentForm;
    });
  }
})();
