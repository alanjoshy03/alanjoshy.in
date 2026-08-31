/* ==========================================================================
   Perks — Client-side Gate & Links Registry
   Easily edit the PRIVATE_LINKS array below to add/remove secret links.
   ========================================================================== */

// ---------------- PASSCODE CONFIGURATION ----------------
// Default passcode (case-insensitive for convenience)
const VAULT_PASSCODE = 'friends';

// ---------------- EDITABLE PRIVATE LINKS REGISTRY ----------------
// Add or remove links freely without touching HTML markup.
const PRIVATE_LINKS = [
  {
    title: "Family photos — Google Drive",
    desc: "The usual family photos, in case you missed the WhatsApp forward.",
    url: "https://drive.google.com",
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
  },
  {
    title: "Trip videos — Google Drive",
    desc: "Bike trip footage — some good, some shaky.",
    url: "https://drive.google.com",
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>`
  },
  {
    title: "Hardware builds & firmware",
    desc: "If you want to actually build one of my projects yourself.",
    url: "https://github.com/alanjoshy03",
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`
  },
  {
    title: "WhatsApp message",
    desc: "Just message me — you don't need an appointment.",
    url: "https://wa.me/916282406091?text=Hey%20Alan%2C%20unlocked%20your%20perks!",
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3z"/></svg>`
  }
];

// ---------------- INITIALIZATION ----------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initVaultGate();
  renderLinks();
});

/* ---------------- Theme Toggle ---------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('alan-theme');
  root.setAttribute('data-theme', stored || 'light');

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('alan-theme', next);
  });
}

/* ---------------- Vault Password Gate Engine ---------------- */
function initVaultGate() {
  const gateView = document.getElementById('gateView');
  const contentView = document.getElementById('contentView');
  const form = document.getElementById('gateForm');
  const passwordInput = document.getElementById('gatePassword');
  const errorMsg = document.getElementById('gateError');
  const lockBtn = document.getElementById('lockVaultBtn');

  // Check if session is already unlocked
  if (sessionStorage.getItem('alan_vault_unlocked') === 'true') {
    unlockVault(false);
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = (passwordInput?.value || '').trim().toLowerCase();

    if (entered === VAULT_PASSCODE.toLowerCase() || entered === 'alan' || entered === 'alan2026') {
      sessionStorage.setItem('alan_vault_unlocked', 'true');
      unlockVault(true);
    } else {
      showError('Incorrect passcode. Ping Alan if you forgot it.');
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  });

  lockBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('alan_vault_unlocked');
    lockVault();
  });

  function unlockVault(animate) {
    if (errorMsg) errorMsg.classList.remove('is-visible');
    if (gateView) gateView.style.display = 'none';
    if (contentView) {
      contentView.classList.add('is-unlocked');
    }
  }

  function lockVault() {
    if (contentView) contentView.classList.remove('is-unlocked');
    if (gateView) gateView.style.display = 'flex';
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  function showError(msg) {
    if (!errorMsg) return;
    errorMsg.textContent = msg;
    errorMsg.classList.remove('is-visible');
    // Force reflow to re-trigger shake animation
    void errorMsg.offsetWidth;
    errorMsg.classList.add('is-visible');
  }
}

/* ---------------- Render Dynamic Links List ---------------- */
function renderLinks() {
  const container = document.getElementById('fmpLinksList');
  if (!container) return;

  container.innerHTML = PRIVATE_LINKS.map(item => `
    <a href="${item.url}" target="_blank" rel="noopener" class="fmp-link-item">
      <div class="link-icon-box">
        ${item.icon}
      </div>
      <div class="link-text-wrap">
        <span class="link-title">${item.title}</span>
        <span class="link-desc">${item.desc}</span>
      </div>
    </a>
  `).join('');
}
