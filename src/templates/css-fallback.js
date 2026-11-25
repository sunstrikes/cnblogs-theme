// Either resource can finish first; only inject after both stylesheets failed.
window.CTP.stylesInstalled = window.CTP.stylesLoaded.then(loaded => {
  if (loaded) return;
  const style = document.createElement('style');
  style.textContent = {{CSS}};
  document.head.append(style);
});
