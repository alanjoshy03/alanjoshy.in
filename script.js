document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileMenu();
  initReveal();
  initTrail();
  initClock();
  initChatFab();
  initJournalCarousel();
  initXPulseRideLauncher();
  initConnectForm();
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

/* ---------------- Header: transparent until hero is scrolled past ---------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const hero = document.getElementById('hero');
  const onScroll = () => {
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight - header.offsetHeight - 40 : 20;
    header.classList.toggle('scrolled', window.scrollY > heroBottom);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
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

/* ---------------- Trail line progress + active dot ---------------- */
function initTrail() {
  const progress = document.querySelector('.trail-progress');
  const dots = document.querySelectorAll('.trail-dot');
  const sections = ['hero', 'work', 'lab', 'journal', 'about', 'connect'].map(id => document.getElementById(id));
  const pathLength = progress.getTotalLength ? progress.getTotalLength() : 1400;
  progress.style.strokeDasharray = pathLength;
  progress.style.strokeDashoffset = pathLength;

  function update() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY;
    const scrollHeight = doc.scrollHeight - window.innerHeight;
    const ratio = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
    progress.style.strokeDashoffset = pathLength * (1 - ratio);

    let activeIndex = 0;
    sections.forEach((sec, i) => {
      if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.5) activeIndex = i;
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === activeIndex));
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
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
  if (!wrap || !fab) return;

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.toggle('open');
  });
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
      window.location.href = `journal-map.html?spot=${spot}`;
    }
  });

  startAutoCycle();
}



/* ---------------- Connect form -> opens mail client with prefilled content ---------------- */
function initConnectForm() {
  const form = document.getElementById('connectForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value;
    const message = document.getElementById('cf-message').value.trim();

    const mailSubject = encodeURIComponent(`${subject} — message from ${name}`);
    const mailBody = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
    window.location.href = `mailto:info@alanjoshy.in?subject=${mailSubject}&body=${mailBody}`;
  });
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
      window.location.href = 'journal-map.html';
    }, 1150);
  }

  // Sync button hover with bike shiver & smoke
  btn.addEventListener('mouseenter', () => bikeActor.classList.add('is-hovered'));
  btn.addEventListener('mouseleave', () => bikeActor.classList.remove('is-hovered'));

  btn.addEventListener('click', launchRide);
  bikeWrap?.addEventListener('click', launchRide);
}

