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

/* ---------------- Journal carousel (Discrete Step: 2s hold per card advance) ---------------- */
function initJournalCarousel() {
  const wrap = document.querySelector('.journal-carousel-wrap');
  const track = document.getElementById('journalCarousel');
  const prevBtn = document.getElementById('journalPrev');
  const nextBtn = document.getElementById('journalNext');
  if (!wrap || !track) return;

  // Duplicate cards for seamless infinite right-to-left stepping
  const originalCards = Array.from(track.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  let isPaused = false;
  let intervalId = null;
  let resumeTimer = null;
  let activeAnimationId = null;
  const HOLD_DURATION = 3000; // 3 seconds hold between steps
  const SCROLL_DURATION = 850; // 850ms smooth cinematic ease transition

  function getCardStep() {
    const card = track.querySelector('.journal-card');
    if (!card) return 340;
    const style = window.getComputedStyle(track);
    let gap = parseFloat(style.columnGap || style.gap);
    if (isNaN(gap)) gap = 22;
    return card.getBoundingClientRect().width + gap;
  }

  // Smooth custom cubic easing scroll
  function smoothScrollTo(targetLeft, duration = SCROLL_DURATION, onComplete) {
    if (activeAnimationId) cancelAnimationFrame(activeAnimationId);

    const startLeft = track.scrollLeft;
    const change = targetLeft - startLeft;
    const startTime = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      track.scrollLeft = startLeft + change * ease;

      if (progress < 1) {
        activeAnimationId = requestAnimationFrame(animate);
      } else {
        activeAnimationId = null;
        if (onComplete) onComplete();
      }
    }

    activeAnimationId = requestAnimationFrame(animate);
  }

  function advanceNextCard() {
    const step = getCardStep();
    const halfWidth = track.scrollWidth / 2;

    // Check if we need to reset scroll position before scrolling forward
    if (track.scrollLeft >= halfWidth - 10) {
      track.scrollLeft -= halfWidth;
    }

    const currentIndex = Math.round(track.scrollLeft / step);
    const targetLeft = (currentIndex + 1) * step;

    smoothScrollTo(targetLeft, SCROLL_DURATION, () => {
      if (track.scrollLeft >= halfWidth - 10) {
        track.scrollLeft -= halfWidth;
      }
    });
  }

  function advancePrevCard() {
    const step = getCardStep();
    const halfWidth = track.scrollWidth / 2;

    if (track.scrollLeft <= 10) {
      track.scrollLeft += halfWidth;
    }

    const currentIndex = Math.round(track.scrollLeft / step);
    const targetLeft = Math.max(0, (currentIndex - 1) * step);

    smoothScrollTo(targetLeft, SCROLL_DURATION);
  }

  // Re-align to exact card boundary on screen resize or orientation change
  window.addEventListener('resize', () => {
    const step = getCardStep();
    const currentIndex = Math.round(track.scrollLeft / step);
    track.scrollLeft = currentIndex * step;
  });



  function startAutoCycle() {
    stopAutoCycle();
    intervalId = setInterval(() => {
      if (!isPaused) {
        advanceNextCard();
      }
    }, HOLD_DURATION);
  }

  function stopAutoCycle() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function pauseAutoCycle(customHold) {
    isPaused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
    if (customHold) {
      resumeTimer = setTimeout(() => {
        isPaused = false;
      }, customHold);
    }
  }

  function resumeAutoCycle() {
    if (resumeTimer) clearTimeout(resumeTimer);
    isPaused = false;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pauseAutoCycle(3500);
      advancePrevCard();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pauseAutoCycle(3500);
      advanceNextCard();
    });
  }

  // Pause on hover
  wrap.addEventListener('mouseenter', () => pauseAutoCycle());
  wrap.addEventListener('mouseleave', () => resumeAutoCycle());

  // Pause on touch or pointer interactions
  wrap.addEventListener('touchstart', () => pauseAutoCycle(), { passive: true });
  wrap.addEventListener('touchend', () => pauseAutoCycle(3000));
  wrap.addEventListener('pointerdown', () => pauseAutoCycle());
  wrap.addEventListener('pointerup', () => pauseAutoCycle(3000));

  // Redirect to map with spot focus when clicking any card
  track.addEventListener('click', (e) => {
    const card = e.target.closest('.journal-card');
    if (card) {
      const spot = card.getAttribute('data-spot') || 'munnar';
      window.location.href = `journal-map?spot=${spot}`;
    }
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    startAutoCycle();
  }
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

