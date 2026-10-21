(() => {
  const dialog = document.getElementById('vr-age-gate');
  if (!dialog) return;
  let confirmed = false;
  try { confirmed = sessionStorage.getItem('vr-age-confirmed-v1') === 'yes'; } catch (error) { /* Ask again if storage is unavailable. */ }
  if (confirmed) {
    document.documentElement.classList.remove('vr-age-pending');
    return;
  }
  const previousFocus = document.activeElement;
  document.documentElement.classList.add('vr-age-pending');
  dialog.addEventListener('cancel', event => event.preventDefault());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href]')].filter(element => element.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  dialog.addEventListener('close', () => { if (!confirmed) dialog.showModal(); });
  dialog.querySelector('[data-age-accept]').addEventListener('click', () => {
    confirmed = true;
    try { sessionStorage.setItem('vr-age-confirmed-v1', 'yes'); } catch (error) { /* Confirmation still works for this page. */ }
    document.documentElement.classList.remove('vr-age-pending');
    dialog.close();
    if (previousFocus instanceof HTMLElement && previousFocus !== document.body) previousFocus.focus();
  });
  dialog.querySelector('[data-age-decline]').addEventListener('click', () => {
    dialog.querySelector('[data-age-question]').hidden = true;
    dialog.querySelector('[data-age-denied]').hidden = false;
    dialog.querySelector('[data-age-denied-title]').focus();
  });
  dialog.showModal();
})();
