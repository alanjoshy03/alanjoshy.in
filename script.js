document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileMenu();
  initReveal();
  initTrail();
  initClock();
  initModal();
  initChatFab();
  initJournalCarousel();
  initConnectForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------- Theme toggle ---------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('alan-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', stored || (prefersLight ? 'light' : 'dark'));

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

/* ---------------- Detail modal (Hardware Lab + Journal "Read more") ---------------- */
const DETAILS = {
  tank: {
    eyebrow: 'Hardware Lab — Embedded / IoT',
    title: 'Smart Tank Manager',
    specs: ['ESP32', 'Ultrasonic sensors', 'Relay control', '7" dashboard', 'WiFi'],
    body: [
      "This one started because I was tired of two things: pumps running dry and tanks overflowing onto the terrace. It watches both the overhead tank and the sump with ultrasonic sensors, and decides on its own when the pump should run.",
      "If the sump is too low, the pump stays off no matter what — that's the dry-run protection, and it's the part I trust the most. A 7\" panel near the tank shows live levels, and the same data is reachable from a website, so I can check it from anywhere without walking up to the terrace."
    ]
  },
  outdoor: {
    eyebrow: 'Hardware Lab — Embedded / IoT',
    title: 'Smart Outdoor Light',
    specs: ['ESP32', 'Astro timer', 'PIR motion sensor', 'WiFi'],
    body: [
      "Outdoor lights that need to be switched on and off by hand always end up forgotten — on at noon, off exactly when you need them. This one calculates sunrise and sunset on its own and follows that automatically.",
      "At night, a motion sensor wakes it up for anyone walking past, and there's a manual override from the website for the odd night you want it a certain way regardless of the schedule."
    ]
  },
  ambient: {
    eyebrow: 'Hardware Lab — Desktop Build',
    title: 'Desktop Ambient Light',
    specs: ['ESP32', 'Screen capture', 'Addressable LEDs', 'WiFi'],
    body: [
      "An Ambilight-style setup — it samples the colours at the edges of whatever's on the monitor in real time and throws matching light onto the wall behind it. Watching a movie or playing something with a lot of colour on screen, the effect is bigger than it sounds.",
      "There's also a fully manual mode if I want a fixed colour or one of the built-in patterns instead, controllable from the same web dashboard as the other builds."
    ]
  },
  theatre: {
    eyebrow: 'Hardware Lab — Audio Engineering',
    title: '5.1 Home Theatre, Auto-Tuned',
    specs: ['500W', 'Custom crossovers', 'Auto room correction', 'WiFi'],
    body: [
      "A 500W 5.1 setup where a microcontroller does the room correction instead of me guessing at an equalizer. It listens to the space it's in and adjusts tone and volume live as the room or the source material changes.",
      "It's tuned closer to what higher-end setups do out of the box, with a handful of presets for different kinds of listening — dialogue-heavy, bass-heavy, that sort of thing — dialed in by ear over a lot of evenings."
    ]
  },
  meesapulimala: {
    eyebrow: 'Journal — Last year',
    title: 'Meesapulimala, with the usual four',
    specs: ['Western Ghats', 'Trek', 'Core group of 4'],
    body: [
      "The main trip of last year — myself and the same three friends who come along for most of these. Meesapulimala is one of the higher points in the Western Ghats, and the climb up is long enough that you stop talking for stretches of it.",
      "This is one of the entries still waiting on a proper photo dump from that trip — will update this with the actual gallery once I've gone through them."
    ]
  },
  chokramudi: {
    eyebrow: 'Journal — Trek',
    title: 'Chokramudi Trek',
    specs: ['Munnar', 'Trek'],
    body: [
      "A steep one near Munnar — short in distance but unforgiving in gradient. The kind of trek where the view at the top makes you forget how much your knees are about to hate you the next morning.",
      "Photos and a fuller writeup for this one are still on the to-do list."
    ]
  },
  vagamon: {
    eyebrow: 'Journal — Camping',
    title: 'Vagamon, a tent in the middle of nowhere',
    specs: ['Vagamon', 'Camping', 'No signal'],
    body: [
      "No fixed plan beyond getting the tent up before dark. Vagamon has these open, misty stretches that make it an easy place to disappear into for a night — no signal, no schedule, just a fire and whoever you came with.",
      "More detail and photos to come as I get around to writing this one up properly."
    ]
  },
  chimmini: {
    eyebrow: 'Journal — Wildlife',
    title: 'Chimmini Wildlife Sanctuary',
    specs: ['Thrissur district', 'Wildlife', 'Slow ride'],
    body: [
      "A slower kind of ride than the usual offroad trips — quieter roads, no real distance target, just a reminder that not every weekend needs to be about how far you got.",
      "Full writeup pending — this section will get more detail as the journal fills back in."
    ]
  },
  vattavada: {
    eyebrow: 'Journal — Road trip',
    title: 'Vattavada',
    specs: ['Idukki district', 'Road trip', 'High altitude'],
    body: [
      "One of the furthest, quietest corners of Kerala I've ridden to — carrot fields, cold mornings, and a long stretch of road back that gives you plenty of time to think about very little.",
      "Photos and the rest of this story are still being put together."
    ]
  }
};

function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const eyebrowEl = document.getElementById('modalEyebrow');
  const titleEl = document.getElementById('modalTitle');
  const specsEl = document.getElementById('modalSpecs');
  const bodyEl = document.getElementById('modalBody');
  if (!overlay) return;

  function openModal(key) {
    const data = DETAILS[key];
    if (!data) return;
    eyebrowEl.textContent = data.eyebrow;
    titleEl.textContent = data.title;
    specsEl.innerHTML = data.specs.map(s => `<span>${s}</span>`).join('');
    bodyEl.innerHTML = data.body.map(p => `<p>${p}</p>`).join('');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-detail')));
  });
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
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

/* ---------------- Journal carousel (prev/next scroll) ---------------- */
function initJournalCarousel() {
  const track = document.getElementById('journalCarousel');
  const prevBtn = document.getElementById('journalPrev');
  const nextBtn = document.getElementById('journalNext');
  if (!track || !prevBtn || !nextBtn) return;

  function cardStep() {
    const card = track.querySelector('.journal-card');
    if (!card) return 340;
    const style = window.getComputedStyle(track);
    let gap = parseFloat(style.columnGap || style.gap);
    if (isNaN(gap)) gap = 22;
    return card.getBoundingClientRect().width + gap;
  }

  prevBtn.addEventListener('click', () => track.scrollBy({ left: -cardStep(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: cardStep(), behavior: 'smooth' }));
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
