(() => {
  // Language pages are complete HTML documents and work without JavaScript,
  // including when index.html is opened directly from the filesystem.
  const printButton = document.querySelector('[data-print]');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => window.print());
  }
  // Keep links from the previous query-string language switch usable.
  const preferred = new URL(location.href).searchParams.get('lang');
  if (['en', 'fa'].includes(preferred) && preferred !== document.documentElement.lang) {
    const target = document.querySelector(`[data-language="${preferred}"]`);
    if (target) location.replace(new URL(target.getAttribute('href'), location.href).href);
  }
})();
