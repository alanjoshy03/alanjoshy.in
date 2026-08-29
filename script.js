document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileMenu();
  initReveal();
  initTrail();
  initClock();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------- Theme toggle ---------------- */
function initTheme(){
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

/* ---------------- Header shadow on scroll ---------------- */
function initHeaderScroll(){
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
}

/* ---------------- Mobile menu ---------------- */
function initMobileMenu(){
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  btn.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

/* ---------------- Scroll reveal ---------------- */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));
}

/* ---------------- Trail line progress + active dot ---------------- */
function initTrail(){
  const progress = document.querySelector('.trail-progress');
  const dots = document.querySelectorAll('.trail-dot');
  const sections = ['hero','work','lab','journal','about'].map(id => document.getElementById(id));
  const pathLength = progress.getTotalLength ? progress.getTotalLength() : 1400;
  progress.style.strokeDasharray = pathLength;
  progress.style.strokeDashoffset = pathLength;

  function update(){
    const doc = document.documentElement;
    const scrollTop = window.scrollY;
    const scrollHeight = doc.scrollHeight - window.innerHeight;
    const ratio = Math.min(scrollTop / scrollHeight, 1);
    progress.style.strokeDashoffset = pathLength * (1 - ratio);

    let activeIndex = 0;
    sections.forEach((sec, i) => {
      if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.5) activeIndex = i;
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === activeIndex));
  }

  window.addEventListener('scroll', update, { passive:true });
  window.addEventListener('resize', update);
  update();
}

/* ---------------- Live IST clock ---------------- */
function initClock(){
  const el = document.getElementById('liveClock');
  if (!el) return;
  function tick(){
    const options = { timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit', hour12:false };
    el.textContent = new Intl.DateTimeFormat([], options).format(new Date()) + ' IST';
  }
  tick();
  setInterval(tick, 1000 * 30);
}
