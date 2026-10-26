(() => {
  // Language pages are complete HTML documents and work without JavaScript,
  // including when index.html is opened directly from the filesystem.
  const printButton = document.querySelector('[data-print]');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', async () => {
      printButton.disabled = true;
      try {
        await Promise.allSettled([
          document.fonts.ready,
          ...Array.from(document.images, image => {
            image.loading = 'eager';
            return image.decode();
          })
        ]);
        window.print();
      } finally {
        printButton.disabled = false;
      }
    });
  }
  // Calendar-month precision matches the source dates; overlapping roles are not added.
  const current = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tehran', year: 'numeric', month: 'numeric'
  }).formatToParts(current);
  const datePart = type => Number(parts.find(part => part.type === type).value);
  const numbers = new Intl.NumberFormat(document.documentElement.lang, { useGrouping: false });
  document.querySelectorAll('[data-experience-start]').forEach(element => {
    const [year, month] = element.dataset.experienceStart.split('-').map(Number);
    const years = Math.max(0, Math.floor(((datePart('year') - year) * 12 + datePart('month') - month) / 12));
    element.textContent = element.dataset.yearsPattern.replace('{years}', numbers.format(years));
  });
  document.querySelectorAll('[data-duration-start]').forEach(element => {
    const [year, month] = element.dataset.durationStart.split('-').map(Number);
    const total = Math.max(1, (datePart('year') - year) * 12 + datePart('month') - month + 1);
    const years = Math.floor(total / 12), months = total % 12;
    const fa = document.documentElement.lang === 'fa';
    const duration = [];
    if (years) duration.push(numbers.format(years) + (fa ? ' سال' : years === 1 ? ' yr' : ' yrs'));
    if (months && !years) duration.push(numbers.format(months) + (fa ? ' ماه' : months === 1 ? ' mo' : ' mos'));
    element.textContent = ' · ' + duration.join(fa ? ' و ' : ' ');
  });
  // Keep links from the previous query-string language switch usable.
  const preferred = new URL(location.href).searchParams.get('lang');
  if (['en', 'fa'].includes(preferred) && preferred !== document.documentElement.lang) {
    const target = document.querySelector(`[data-language="${preferred}"]`);
    if (target) location.replace(new URL(target.getAttribute('href'), location.href).href);
  }
})();
