// ==========================================================================
// Alan Joshy — SPA Multi-Page Engine & Interactive Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initNavbar();
  initMobileMenu();
  initPortfolioFilters();
  initLiveClock();
});

// --------------------------------------------------------------------------
// 1. Single Page Application (SPA) Multi-Page Router
// --------------------------------------------------------------------------
function initRouter() {
  const routeMap = {
    '': 'page-home',
    'home': 'page-home',
    'hero': 'page-home',
    'services': 'page-services',
    'portfolio': 'page-portfolio',
    'hardware-lab': 'page-hardware-lab',
    'interactive-lab': 'page-hardware-lab',
    'about': 'page-about',
    'journey': 'page-about',
    'contact': 'page-contact'
  };

  function handleRouteChange() {
    const rawHash = window.location.hash || '#home';
    const cleanHash = rawHash.replace(/^#\/?/, '').toLowerCase();
    const targetPageId = routeMap[cleanHash] || 'page-home';

    // 1. Activate Target Page View
    const pageViews = document.querySelectorAll('.page-view');
    pageViews.forEach(page => {
      if (page.id === targetPageId) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // 2. Update Navigation Active Underline Indicator
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-links .mobile-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkHash = href.replace(/^#\/?/, '').toLowerCase();
      const mappedId = routeMap[linkHash] || linkHash;

      if (mappedId === targetPageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 3. Scroll to top of the newly activated page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange(); // Trigger on initial load
}

// --------------------------------------------------------------------------
// 2. Navbar Scroll Effects
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
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !mobileDrawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.style.display === 'block';
    mobileDrawer.style.display = isOpen ? 'none' : 'block';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.style.display = 'none';
    });
  });
}

// --------------------------------------------------------------------------
// 3. Portfolio Filter Pills
// --------------------------------------------------------------------------
function initPortfolioFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = card.classList.contains('project-featured') ? 'grid' : 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// 4. Interactive Hardware Sandbox Controls (ESP32 Controller)
// --------------------------------------------------------------------------
let pumpState = false;
let plugState = true;

function togglePumpRelay() {
  pumpState = !pumpState;
  const textEl = document.getElementById('relay-1-text');
  const btnEl = document.getElementById('relay-1-btn');

  if (pumpState) {
    if (textEl) { textEl.innerText = 'PUMP ACTIVE (RUNNING)'; textEl.classList.add('on'); }
    if (btnEl) { btnEl.innerText = 'Stop Pump'; btnEl.classList.add('on'); }
    logToTerminal(`[RELAY] GPIO 18 HIGH -> Auto-pump relay engaged. Overhead: filling | Flow rate: 24L/min`);
  } else {
    if (textEl) { textEl.innerText = 'STANDBY / ARMED'; textEl.classList.remove('on'); }
    if (btnEl) { btnEl.innerText = 'Trigger Pump'; btnEl.classList.remove('on'); }
    logToTerminal(`[RELAY] GPIO 18 LOW -> Pump cut-off disengaged. System in standby.`);
  }
}

function toggleSmartPlug() {
  plugState = !plugState;
  const textEl = document.getElementById('relay-2-text');
  const btnEl = document.getElementById('relay-2-btn');

  if (plugState) {
    if (textEl) { textEl.innerText = 'ACTIVE (SCHEDULED)'; textEl.classList.add('on'); }
    if (btnEl) { btnEl.classList.add('on'); }
    logToTerminal(`[SMART-PLUG] Workstation AC relay ON (Schedule slot 09:00-22:00 active).`);
  } else {
    if (textEl) { textEl.innerText = 'OFFLINE (OVERRIDDEN)'; textEl.classList.remove('on'); }
    if (btnEl) { btnEl.classList.remove('on'); }
    logToTerminal(`[SMART-PLUG] Workstation AC relay OFF (Manual override dispatched).`);
  }
}

function simulateTankTelemetryPing() {
  const overhead = Math.floor(70 + Math.random() * 22);
  const sump = Math.floor(80 + Math.random() * 18);
  const rssi = -(45 + Math.floor(Math.random() * 10));
  const latency = Math.floor(8 + Math.random() * 10);

  logToTerminal(`[SENSOR] Ultrasonic Overhead: ${overhead}% | Sump: ${sump}% | Flow: Normal (Mesh RSSI: ${rssi} dBm | Latency: ${latency}ms).`);
}

function logToTerminal(msg) {
  const terminal = document.getElementById('iot-terminal');
  if (!terminal) return;

  const now = new Date();
  const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

  const line = document.createElement('div');
  line.className = 'term-row';
  line.innerHTML = `<span class="term-ts">${timeStr}</span> ${msg}`;

  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

// --------------------------------------------------------------------------
// 5. Direct Contact & Copy Actions
// --------------------------------------------------------------------------
function copyEmailToClipboard() {
  const email = 'info@alanjoshy.in';
  navigator.clipboard.writeText(email).then(() => {
    const toasts = document.querySelectorAll('.copy-toast');
    toasts.forEach(toast => {
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    });
  }).catch(() => {
    alert('Email address: ' + email);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const feedback = form.querySelector('.form-feedback');
  const nameInput = form.querySelector('input[type="text"]');
  const name = nameInput ? nameInput.value : 'there';

  if (submitBtn) {
    submitBtn.innerText = 'SENDING...';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.innerText = 'MESSAGE SENT ✓';
    }
    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.color = '#27c93f';
      feedback.innerText = `Thank you, ${name}. Your message has been routed to Alan's primary inbox.`;
    }
    form.reset();
  }, 900);
}

// --------------------------------------------------------------------------
// 6. Live Indian Standard Time (IST) Clock
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
    clockEl.innerText = `${formatter.format(new Date())} IST · India`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}
