// Replay the platform's read-only, same-origin sidebar response into its native slot.
(async () => {
  const column = document.getElementById('blog-sidecolumn');
  if (!column) return;
  const response = await fetch('/sample/ajax/sidebar-lists');
  if (!response.ok) return;
  const { sideColumn, topLists } = await response.json();
  column.innerHTML = sideColumn + topLists;
})();
