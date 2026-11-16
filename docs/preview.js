(() => {
  const authPath = () => /^\/SKYNZ-2\.0\/(?:login|register)\/?$/.test(location.pathname);
  const disableAuth = () => {
    if (!authPath()) return;
    for (const control of document.querySelectorAll('#root form input, #root form button[type="submit"], #root form button:not([type])')) {
      if (!control.disabled) control.disabled = true;
    }
  };
  new MutationObserver(disableAuth).observe(document.getElementById('root'), {childList:true, subtree:true});
  document.addEventListener('submit', event => {
    if (authPath()) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  disableAuth();
})();
