document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollEffects();
  initMobileMenu();
  initReveal();
  initClock();
  initChatFab();
  initJournalCarousel();
  initXPulseRideLauncher();
  initCircuitTransition();
  initHardwareLabAccordion();
  initConnectForm();
  initCustomSelect();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------- Theme toggle (Default to daymode / light) ---------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('alan-theme');
  // Always default to daymode ('light') unless user manually toggled previously
  root.setAttribute('data-theme', stored || 'light');

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('alan-theme', next);
  });
}

/* ---------------- Header scroll, scroll progress bar & active nav spy ---------------- */
function initScrollEffects() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = ['work', 'lab', 'journal', 'about'].map(id => document.getElementById(id)).filter(Boolean);
  const bar = document.getElementById('scrollProgressBar');

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;

    // Translucent from the first scroll itself
    if (header) {
      header.classList.toggle('scrolled', scrollY > 8);
    }

    // Top Horizontal Scroll Progress Bar
    if (bar) {
      const doc = document.documentElement;
      const scrollTop = scrollY || doc.scrollTop || 0;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100) : 0;
      bar.style.width = `${progress}%`;
    }

    // Active section highlight spy
    let currentId = '';
    const atBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);

    if (atBottom) {
      currentId = 'about';
    } else {
      sections.forEach(sec => {
        const top = sec.offsetTop;
        if (scrollY + (window.innerHeight * 0.38) >= top) {
          currentId = sec.id;
        }
      });
      const hero = document.getElementById('hero');
      if (hero && scrollY < (hero.offsetHeight * 0.45)) {
        currentId = '';
      }
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === `#${currentId}`);
    });

    ticking = false;
  };

  const onScrollOrResize = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  update();
}

/* ---------------- Mobile menu ---------------- */
function initMobileMenu() {
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  const header = document.getElementById('siteHeader');

  function setOpen(open) {
    nav.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    btn.classList.toggle('open', open);
  }

  btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
}

/* ---------------- Scroll reveal ---------------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));
}

/* ---------------- Live IST clock ---------------- */
function initClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  function tick() {
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false };
    el.textContent = new Intl.DateTimeFormat([], options).format(new Date()) + ' IST';
  }
  tick();
  setInterval(tick, 1000 * 30);
}




/* ---------------- Chat FAB (WhatsApp / Email popup) ---------------- */
function initChatFab() {
  const wrap = document.querySelector('.chat-fab-wrap');
  const fab = document.getElementById('chatFab');
  const mailOption = document.getElementById('chatMailOption');
  if (!wrap || !fab) return;

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.toggle('open');
  });

  if (mailOption) {
    mailOption.addEventListener('click', () => {
      // Copy email to clipboard as backup for users without desktop email clients
      navigator.clipboard?.writeText('info@alanjoshy.in').then(() => {
        const small = mailOption.querySelector('small');
        if (small) {
          const orig = small.textContent;
          small.textContent = 'Copied to clipboard!';
          setTimeout(() => { small.textContent = orig; }, 2500);
        }
      }).catch(() => {});
    });
  }

  document.addEventListener('click', (e) => {
    if (wrap.classList.contains('open') && !wrap.contains(e.target)) {
      wrap.classList.remove('open');
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') wrap.classList.remove('open'); });
}

/* ---------------- Journal carousel (Optimized for 60-120 FPS on all devices) ---------------- */
function initJournalCarousel() {
  const wrap = document.querySelector('.journal-carousel-wrap');
  const track = document.getElementById('journalCarousel');
  const prevBtn = document.getElementById('journalPrev');
  const nextBtn = document.getElementById('journalNext');
  if (!wrap || !track) return;

  let cachedMaxScroll = 0;
  let isTicking = false;
  let prevIsStart = null;
  let nextIsEnd = null;

  function updateMetrics() {
    cachedMaxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    updateButtonStates();
  }

  function getCardStep() {
    const card = track.querySelector('.journal-card');
    if (!card) return 340;
    const style = window.getComputedStyle(track);
    let gap = parseFloat(style.columnGap || style.gap);
    if (isNaN(gap)) gap = 18;
    return card.getBoundingClientRect().width + gap;
  }

  function updateButtonStates() {
    if (!prevBtn && !nextBtn) return;
    const current = track.scrollLeft;

    if (prevBtn) {
      const isStart = current <= 12;
      if (isStart !== prevIsStart) {
        prevIsStart = isStart;
        prevBtn.disabled = isStart;
        prevBtn.setAttribute('aria-disabled', isStart ? 'true' : 'false');
      }
    }
    if (nextBtn) {
      const isEnd = current >= cachedMaxScroll - 12;
      if (isEnd !== nextIsEnd) {
        nextIsEnd = isEnd;
        nextBtn.disabled = isEnd;
        nextBtn.setAttribute('aria-disabled', isEnd ? 'true' : 'false');
      }
    }
  }

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateButtonStates();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  // Button navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const step = getCardStep();
      track.scrollBy({ left: -step, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const step = getCardStep();
      track.scrollBy({ left: step, behavior: 'smooth' });
    });
  }

  // Throttled scroll & cached resize listeners
  track.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateMetrics, { passive: true });
  updateMetrics();

  // Mouse drag-to-scroll (only active during actual mouse hold)
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let hasDragged = false;

  function onMouseMove(e) {
    if (!isDown) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX);
    if (Math.abs(walk) > 4) {
      hasDragged = true;
    }
    track.scrollLeft = scrollLeftStart - walk;
  }

  function onMouseUp() {
    if (isDown) {
      isDown = false;
      track.classList.remove('is-dragging');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
  }

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    hasDragged = false;
    track.classList.add('is-dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeftStart = track.scrollLeft;
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
  });

  // Card click handling - only navigate if user didn't drag
  track.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const card = e.target.closest('.journal-card');
    if (card) {
      const spot = card.getAttribute('data-spot');
      if (spot && spot !== 'all') {
        window.location.href = `journal-map?spot=${spot}`;
      } else {
        window.location.href = `journal-map`;
      }
    }
  });
}



/* ---------------- Connect form -> Direct Netlify inbox submission with in-theme success ---------------- */
function initConnectForm() {
  const form = document.getElementById('connectForm');
  const fieldsWrap = document.getElementById('formFieldsWrap');
  const successState = document.getElementById('formSuccessState');
  const submitBtn = document.getElementById('cf-submit-btn');
  const resetBtn = document.getElementById('resetFormBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    const formData = new FormData(form);

    try {
      // Send directly to Netlify Forms backend endpoint
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok || response.status === 200 || response.type === 'opaque') {
        showSuccess();
      } else {
        // Fallback for local testing if not running on Netlify server
        fallbackSubmit();
      }
    } catch (err) {
      showSuccess();
    }
  });

  function showSuccess() {
    if (fieldsWrap) fieldsWrap.style.display = 'none';
    if (successState) {
      successState.style.display = 'flex';
      requestAnimationFrame(() => {
        successState.classList.add('is-visible');
      });
    }
    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  }

  function fallbackSubmit() {
    const name = document.getElementById('cf-name')?.value.trim() || '';
    const email = document.getElementById('cf-email')?.value.trim() || '';
    const subject = document.getElementById('cf-subject')?.value || 'New message';
    const message = document.getElementById('cf-message')?.value.trim() || '';
    const mailSubject = encodeURIComponent(`${subject} — message from ${name}`);
    const mailBody = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
    window.location.href = `mailto:info@alanjoshy.in?subject=${mailSubject}&body=${mailBody}`;
    showSuccess();
  }

  resetBtn?.addEventListener('click', () => {
    if (successState) {
      successState.classList.remove('is-visible');
      successState.style.display = 'none';
    }
    if (fieldsWrap) {
      fieldsWrap.style.display = 'flex';
    }
  });
}

/* ---------------- Custom In-Theme Select Dropdown ---------------- */
function initCustomSelect() {
  const select = document.getElementById('cf-subject');
  if (!select) return;

  // Prevent duplicate initialization
  if (select.parentElement.classList.contains('custom-select-wrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'custom-select-wrap';

  const trigger = document.createElement('div');
  trigger.className = 'custom-select-trigger';
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-expanded', 'false');

  const selectedText = document.createElement('span');
  selectedText.className = 'custom-select-label';
  selectedText.textContent = select.options[select.selectedIndex]?.text || 'Select subject';

  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.setAttribute('class', 'custom-select-chevron');
  chevron.setAttribute('viewBox', '0 0 24 24');
  chevron.setAttribute('fill', 'none');
  chevron.setAttribute('stroke', 'currentColor');
  chevron.setAttribute('stroke-width', '2.2');
  chevron.innerHTML = '<path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>';

  trigger.appendChild(selectedText);
  trigger.appendChild(chevron);

  const menu = document.createElement('div');
  menu.className = 'custom-select-menu';
  menu.setAttribute('role', 'listbox');

  Array.from(select.options).forEach((opt, idx) => {
    const item = document.createElement('div');
    item.className = 'custom-select-opt' + (idx === select.selectedIndex ? ' is-selected' : '');
    item.textContent = opt.text;
    item.setAttribute('role', 'option');
    item.setAttribute('data-value', opt.value);

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      select.value = opt.value;
      selectedText.textContent = opt.text;
      menu.querySelectorAll('.custom-select-opt').forEach(el => el.classList.remove('is-selected'));
      item.classList.add('is-selected');
      wrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      select.dispatchEvent(new Event('change'));
    });

    menu.appendChild(item);
  });

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = wrap.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      wrap.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    } else if (e.key === 'Escape') {
      wrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {
      wrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Hide native select visually while keeping it active for form data
  select.style.position = 'absolute';
  select.style.opacity = '0';
  select.style.pointerEvents = 'none';
  select.style.height = '0';
  select.style.width = '0';
  select.style.margin = '0';
  select.setAttribute('tabindex', '-1');

  select.parentNode.insertBefore(wrap, select);
  wrap.appendChild(trigger);
  wrap.appendChild(menu);
  wrap.appendChild(select);
}

/* ---------------- XPulse In-Place Engine Start & Smoke Transition ---------------- */
function initXPulseRideLauncher() {
  const btn = document.getElementById('rideLaunchBtn');
  const bikeWrap = document.getElementById('mapStripBikeWrap');
  const bikeActor = document.getElementById('bikeActorBox');
  const overlay = document.getElementById('xpulseRideOverlay');
  if (!btn || !bikeActor || !overlay) return;

  let isLaunching = false;

  function launchRide(e) {
    if (e) e.preventDefault();
    if (isLaunching) return;
    isLaunching = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.location.href = 'journal-map';
      return;
    }

    // Step 1: In-place engine start vibration & smoke puffs from exhaust silencer
    bikeActor.classList.add('is-starting');

    // Step 2: Rev up, launch forward to right & fade in fullscreen smoke curtain
    setTimeout(() => {
      bikeActor.classList.remove('is-starting');
      bikeActor.classList.add('is-launching');
      overlay.classList.add('is-active');
    }, 450);

    // Step 3: Transition to the map page as smoke covers screen
    setTimeout(() => {
      window.location.href = 'journal-map';
    }, 1150);
  }

  // Sync button hover with bike shiver & smoke
  btn.addEventListener('mouseenter', () => bikeActor.classList.add('is-hovered'));
  btn.addEventListener('mouseleave', () => bikeActor.classList.remove('is-hovered'));

  btn.addEventListener('click', launchRide);
  bikeWrap?.addEventListener('click', launchRide);
}

/* ---------------- Hardware Lab Circuit Micro-Transition ---------------- */
function initCircuitTransition() {
  const overlay = document.getElementById('circuitOverlay');
  if (!overlay) return;

  const stage = overlay.querySelector('.circuit-stage');
  const traces = overlay.querySelectorAll('.pcb-trace');

  // Compute exact path length for each PCB trace
  traces.forEach(path => {
    const len = Math.ceil(path.getTotalLength ? path.getTotalLength() : 500);
    path.setAttribute('data-len', len);
    path.style.strokeDasharray = `${len} ${len}`;
    path.style.strokeDashoffset = `${len}`;
  });

  let isNavigating = false;

  // Reset overlay when returning via browser history (bfcache)
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('is-active');
    traces.forEach(path => {
      const len = path.getAttribute('data-len') || 500;
      path.style.strokeDashoffset = `${len}`;
    });
    isNavigating = false;
  });

  // Intercept all links targeting hardware-lab
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Match links targeting hardware-lab (e.g. hardware-lab.html?build=ambient, /hardware-lab, etc.)
    const isHardwareLink = href.includes('hardware-lab');
    if (!isHardwareLink) return;

    // Allow user modifiers for new tab / window
    if (e.metaKey || e.ctrlKey || e.shiftKey || link.target === '_blank') return;

    // Respect prefers-reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    e.preventDefault();
    if (isNavigating) return;
    isNavigating = true;

    // Dynamically anchor the circuit origin to the click position
    if (stage) {
      let clickX = e.clientX;
      let clickY = e.clientY;

      // Fallback to link center if coordinates are 0 (e.g. keyboard accessibility or touch tap offset)
      if (typeof clickX !== 'number' || (clickX === 0 && clickY === 0)) {
        const rect = link.getBoundingClientRect();
        clickX = rect.left + rect.width / 2;
        clickY = rect.top + rect.height / 2;
      }

      stage.style.left = `${clickX}px`;
      stage.style.top = `${clickY}px`;
    }

    // Reset traces with no transition
    traces.forEach(path => {
      const len = path.getAttribute('data-len') || 500;
      path.style.transition = 'none';
      path.style.strokeDashoffset = `${len}`;
    });
    void overlay.offsetWidth; // Force synchronous reflow

    // Activate overlay and animate traces to 0
    requestAnimationFrame(() => {
      overlay.classList.add('is-active');
      traces.forEach(path => {
        path.style.transition = '';
        path.style.strokeDashoffset = '0';
      });
    });

    // Complete navigation quickly (~480ms)
    setTimeout(() => {
      window.location.href = href;
    }, 480);
  });
}

/* ---------------- Hardware Lab Mobile Accordion ---------------- */
function initHardwareLabAccordion() {
  const labGrid = document.querySelector('.lab-grid');
  if (!labGrid) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');

  labGrid.addEventListener('click', (e) => {
    // Only active on mobile screens
    if (!mobileQuery.matches) return;

    // Do NOT intercept clicks on links (e.g. Read more ->)
    if (e.target.closest('a')) return;

    const card = e.target.closest('.lab-card');
    if (!card || !labGrid.contains(card)) return;

    const isCurrentlyExpanded = card.classList.contains('is-expanded');

    // Collapse all cards in the grid (single expanded accordion)
    labGrid.querySelectorAll('.lab-card').forEach((c) => {
      c.classList.remove('is-expanded');
      const toggle = c.querySelector('.lab-card-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });

    // If it was not already open, expand it
    if (!isCurrentlyExpanded) {
      card.classList.add('is-expanded');
      const toggle = card.querySelector('.lab-card-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }
  });

  // Reset expanded state if window is resized above mobile breakpoint
  mobileQuery.addEventListener('change', (e) => {
    if (!e.matches) {
      labGrid.querySelectorAll('.lab-card').forEach((c) => {
        c.classList.remove('is-expanded');
        const toggle = c.querySelector('.lab-card-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });
}


