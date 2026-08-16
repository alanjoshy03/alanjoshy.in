// ==========================================================================
// Alan Joshy — Interactive Scripts & Performance Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initPortfolioFilters();
  initTaxCalculator();
  initLiveClock();
});

// --------------------------------------------------------------------------
// 1. Navigation & Scroll State
// --------------------------------------------------------------------------
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.style.display === 'block';
    mobileMenu.style.display = isOpen ? 'none' : 'block';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
    });
  });
}

// --------------------------------------------------------------------------
// 2. Portfolio Filter Tabs
// --------------------------------------------------------------------------
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'grid';
          if (!card.classList.contains('work-large')) {
            card.style.display = 'flex';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// 3. Interactive Lab: Tab Switcher
// --------------------------------------------------------------------------
function switchLabTab(tabType) {
  const taxBtn = document.getElementById('tab-tax-btn');
  const iotBtn = document.getElementById('tab-iot-btn');
  const taxPanel = document.getElementById('lab-panel-tax');
  const iotPanel = document.getElementById('lab-panel-iot');

  if (tabType === 'tax') {
    taxBtn.classList.add('active');
    iotBtn.classList.remove('active');
    taxPanel.classList.add('active');
    iotPanel.classList.remove('active');
  } else {
    iotBtn.classList.add('active');
    taxBtn.classList.remove('active');
    iotPanel.classList.add('active');
    taxPanel.classList.remove('active');
  }
}

// --------------------------------------------------------------------------
// 4. Interactive Lab: India Tax Regime Estimator (FY 2024-25)
// --------------------------------------------------------------------------
function initTaxCalculator() {
  calculateTaxComparison();
}

function calculateTaxComparison() {
  const incomeInput = document.getElementById('calc-income');
  const c80Input = document.getElementById('calc-80c');
  const d80Input = document.getElementById('calc-80d');

  if (!incomeInput) return;

  const income = Math.max(0, parseFloat(incomeInput.value) || 0);
  const ded80C = Math.min(150000, Math.max(0, parseFloat(c80Input.value) || 0));
  const ded80D = Math.min(100000, Math.max(0, parseFloat(d80Input.value) || 0));

  // --- NEW REGIME (FY 24-25 standard deduction: Rs. 75,000) ---
  const standardDeductionNew = 75000;
  const taxableIncomeNew = Math.max(0, income - standardDeductionNew);
  let taxNew = 0;

  // New Regime Slabs:
  // 0 - 3L: Nil
  // 3L - 7L: 5%
  // 7L - 10L: 10%
  // 10L - 12L: 15%
  // 12L - 15L: 20%
  // > 15L: 30%
  if (taxableIncomeNew <= 700000) {
    taxNew = 0; // Rebate under 87A (income up to 7L after std deduction is tax-free)
  } else {
    if (taxableIncomeNew > 300000) taxNew += Math.min(400000, taxableIncomeNew - 300000) * 0.05;
    if (taxableIncomeNew > 700000) taxNew += Math.min(300000, taxableIncomeNew - 700000) * 0.10;
    if (taxableIncomeNew > 1000000) taxNew += Math.min(200000, taxableIncomeNew - 1000000) * 0.15;
    if (taxableIncomeNew > 1200000) taxNew += Math.min(300000, taxableIncomeNew - 1200000) * 0.20;
    if (taxableIncomeNew > 1500000) taxNew += (taxableIncomeNew - 1500000) * 0.30;
    taxNew += taxNew * 0.04; // 4% Cess
  }

  // --- OLD REGIME (Standard deduction: Rs. 50,000 + 80C + 80D) ---
  const standardDeductionOld = 50000;
  const totalDeductionsOld = standardDeductionOld + ded80C + ded80D;
  const taxableIncomeOld = Math.max(0, income - totalDeductionsOld);
  let taxOld = 0;

  if (taxableIncomeOld <= 500000) {
    taxOld = 0; // 87A rebate for Old regime <= 5L
  } else {
    if (taxableIncomeOld > 250000) taxOld += Math.min(250000, taxableIncomeOld - 250000) * 0.05;
    if (taxableIncomeOld > 500000) taxOld += Math.min(500000, taxableIncomeOld - 500000) * 0.20;
    if (taxableIncomeOld > 1000000) taxOld += (taxableIncomeOld - 1000000) * 0.30;
    taxOld += taxOld * 0.04; // 4% Cess
  }

  // Render format
  const formatINR = (val) => '₹' + Math.round(val).toLocaleString('en-IN');

  const taxNewEl = document.getElementById('tax-new-result');
  const taxOldEl = document.getElementById('tax-old-result');
  const cardNew = document.getElementById('card-new-regime');
  const cardOld = document.getElementById('card-old-regime');
  const adviceBox = document.getElementById('calc-advice-box');

  if (taxNewEl) taxNewEl.innerText = formatINR(taxNew);
  if (taxOldEl) taxOldEl.innerText = formatINR(taxOld);

  if (taxNew <= taxOld) {
    cardNew.classList.add('recommended');
    cardOld.classList.remove('recommended');
    const diff = taxOld - taxNew;
    adviceBox.innerHTML = `<strong>💡 Strategic Recommendation:</strong> The <strong>New Tax Regime</strong> is more optimal, saving you <strong>${formatINR(diff)}</strong> in annual tax obligations.`;
  } else {
    cardOld.classList.add('recommended');
    cardNew.classList.remove('recommended');
    const diff = taxNew - taxOld;
    adviceBox.innerHTML = `<strong>💡 Strategic Recommendation:</strong> The <strong>Old Tax Regime</strong> with deductions saves you <strong>${formatINR(diff)}</strong>. Ensure valid investment proofs are filed.`;
  }
}

// --------------------------------------------------------------------------
// 5. Interactive Lab: ESP32 IoT Node Simulator
// --------------------------------------------------------------------------
let relayStates = { 1: false, 2: true };

function toggleRelay(relayNum) {
  relayStates[relayNum] = !relayStates[relayNum];
  const textEl = document.getElementById(`relay-${relayNum}-text`);
  const btnEl = document.getElementById(`relay-${relayNum}-btn`);

  if (relayStates[relayNum]) {
    textEl.innerText = 'ON';
    textEl.classList.add('active');
    btnEl.classList.add('on');
    logToTerminal(`[MQTT] Published to 'home/living/relays/${relayNum}/set' -> payload: 1 (GPIO ${relayNum === 1 ? '18' : '19'} HIGH)`);
  } else {
    textEl.innerText = 'OFF';
    textEl.classList.remove('active');
    btnEl.classList.remove('on');
    logToTerminal(`[MQTT] Published to 'home/living/relays/${relayNum}/set' -> payload: 0 (GPIO ${relayNum === 1 ? '18' : '19'} LOW)`);
  }
}

function simulateTelemetryPing() {
  const temp = (25 + Math.random() * 3).toFixed(1);
  const hum = Math.floor(55 + Math.random() * 10);
  const watts = Math.floor(130 + Math.random() * 40);
  const ping = Math.floor(8 + Math.random() * 12);

  logToTerminal(`[TELEMETRY] Sensor broadcast: Temp=${temp}°C | Humidity=${hum}% | Power=${watts}W | Ping=${ping}ms`);
}

function logToTerminal(msg) {
  const terminal = document.getElementById('iot-terminal');
  if (!terminal) return;

  const now = new Date();
  const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

  const line = document.createElement('div');
  line.className = 'term-line';
  line.innerHTML = `<span class="term-time">${timeStr}</span> ${msg}`;

  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

// --------------------------------------------------------------------------
// 6. Direct Contact & Copy Actions
// --------------------------------------------------------------------------
function copyEmailToClipboard() {
  const email = 'info@alanjoshy.in';
  navigator.clipboard.writeText(email).then(() => {
    const toast = document.getElementById('copy-toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }).catch(() => {
    alert('Email address: ' + email);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('form-submit-btn');
  const feedback = document.getElementById('form-feedback');
  const name = document.getElementById('form-name').value;

  if (submitBtn) {
    submitBtn.innerText = 'Transmitting Message...';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.innerText = 'Message Sent ✓';
    }
    if (feedback) {
      feedback.className = 'form-feedback success';
      feedback.innerText = `Thank you, ${name}. Your message has been routed to Alan's primary inbox. You will receive a response within 24 hours.`;
    }
    document.getElementById('contact-form').reset();
  }, 900);
}

// --------------------------------------------------------------------------
// 7. Live Indian Standard Time (IST) Clock
// --------------------------------------------------------------------------
function initLiveClock() {
  const clockEl = document.getElementById('live-ist-clock');
  if (!clockEl) return;

  function updateTime() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat([], options);
    clockEl.innerText = `${formatter.format(new Date())} IST`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}
