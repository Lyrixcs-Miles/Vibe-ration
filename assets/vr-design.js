class VrCountdown extends HTMLElement {
  connectedCallback() {
    this.hidden = true;
    const date = this.dataset.end || '';
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/.test(date)) return;
    this.end = Date.parse(date);
    if (!Number.isFinite(this.end)) return;
    this.tick();
    if (!this.hidden) this.interval = setInterval(() => this.tick(), 1000);
  }
  disconnectedCallback() { clearInterval(this.interval); }
  tick() {
    const remaining = Math.floor((this.end - Date.now()) / 1000);
    if (remaining <= 0) {
      this.hidden = true;
      clearInterval(this.interval);
      return;
    }
    const values = { days: Math.floor(remaining / 86400), hours: Math.floor(remaining / 3600) % 24, minutes: Math.floor(remaining / 60) % 60, seconds: remaining % 60 };
    for (const [unit,value] of Object.entries(values)) this.querySelector(`[data-unit="${unit}"]`).textContent = String(value).padStart(2, '0');
    this.hidden = false;
  }
}
if (!customElements.get('vr-countdown')) customElements.define('vr-countdown', VrCountdown);

class VrAgeGate extends HTMLElement {
  connectedCallback() {
    if (window.Shopify?.designMode) return;
    this.dialog = this.querySelector('dialog');
    try { if (sessionStorage.getItem('vr-age-confirmed') === 'yes') return; } catch {}
    this.previousFocus = document.activeElement;
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.dialog.showModal();
    this.dialog.addEventListener('cancel', event => event.preventDefault());
    this.querySelector('[data-age-accept]').addEventListener('click', () => {
      try { sessionStorage.setItem('vr-age-confirmed', 'yes'); } catch {}
      this.dialog.close();
      document.body.style.overflow = this.previousOverflow;
      if (this.previousFocus instanceof HTMLElement) this.previousFocus.focus();
    }, { once: true });
  }
  disconnectedCallback() { if (this.dialog?.open) document.body.style.overflow = this.previousOverflow; }
}
if (!customElements.get('vr-age-gate')) customElements.define('vr-age-gate', VrAgeGate);
