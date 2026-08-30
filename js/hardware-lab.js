/**
 * Hardware Lab — Workshop Notes Engine
 * Honest, first-person build writeups + a real photo stage with organic idle motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBuildEngine();
  initIdleMotion();
  checkUrlBuildParam();
});

/* ---------------- Theme Toggle (sync with main site) ---------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('alan-theme');
  const initial = stored || 'light';
  root.setAttribute('data-theme', initial);

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('alan-theme', next);
  });
}

/* ---------------- Hardware Builds — written the way I'd actually explain these ---------------- */
const BUILDS = {
  ambient: {
    index: '01 / 06',
    tag: 'Desk build',
    title: 'Desktop Ambient Light',
    image: 'images/hardware/ambient-light.jpg',
    summary: "Samples the colour at the edges of whatever's on my monitor and throws matching light onto the wall behind it. Nothing scientific about it — it just stops the screen from being the one bright rectangle in an otherwise dark room.",
    story: "Started this because staring at a bright screen in a dark room for six hours straight isn't great on the eyes, and the cheap ambilight strips I looked at online were either laggy or needed their own app that phoned home to some server I didn't trust. So I built my own with an ESP32 grabbing edge colours over serial and pushing them out to an LED strip. There's a manual mode too, for when I just want a fixed colour instead of whatever's on screen.",
    highlights: [
      "Keeps up fine with fast-moving scenes — the odd frame lags a beat behind, but you'd have to be looking for it.",
      "Manual mode for a fixed colour or a couple of preset patterns, controlled from the same dashboard as the other builds.",
      "Whole thing cost less than one of the branded kits, and I actually know how to fix it when something breaks."
    ],
    whatsappMsg: "Hi Alan, saw the ambient light build on your site — could you build something similar for my desk?",
    ctaLabel: "Ask me about this build",
    hotspots: [
      { id: '1', x: 50, y: 48, title: 'Colour sampling', desc: "Grabs edge colours off the screen and pushes them to the strip over serial." },
      { id: '2', x: 50, y: 15, title: 'The strip itself', desc: "Runs along the back of the desk alcove — nothing fancy, just WS2812B LEDs." },
      { id: '3', x: 75, y: 56, title: 'Wiring', desc: "Tucked behind the desk. Not as tidy as I'd like, if I'm honest." },
      { id: '4', x: 50, y: 82, title: 'ESP32', desc: "Does the actual colour-reading and dimming logic." }
    ]
  },

  mist: {
    index: '02 / 06',
    tag: 'Home build',
    title: 'Presence-Aware Mist Diffuser',
    image: 'images/hardware/mist-sprayer.jpg',
    summary: "A desk diffuser that notices when you've walked into the room and turns itself on, instead of running non-stop until the water tank's empty or sitting off because you forgot about it.",
    story: "Regular diffusers are dumb in one of two directions — either they run constantly and burn through water in a day, or you have to remember to switch them on yourself, which I never do. This one has a presence sensor, so it wakes up when someone's actually in the room and goes quiet again once you leave. Still a work in progress — the schedule logic could be smarter, and I want to add proper smart-home pairing eventually rather than the basic version it has now.",
    highlights: [
      "Turns on by itself when it senses someone's in the room, and stops when they leave.",
      "A couple of scent/intensity settings — nothing elaborate, just enough to not be one-note.",
      "Still tinkering with this one, so the schedule behaviour might change."
    ],
    whatsappMsg: "Hi Alan, interested in the presence-aware diffuser build on your site — is this something you could set up for me?",
    ctaLabel: "Ask me about this build",
    hotspots: [
      { id: '1', x: 50, y: 22, title: 'Mist output', desc: "Ultrasonic vapor — the fine kind, not the visible steam-like mist." },
      { id: '2', x: 50, y: 52, title: 'Status display', desc: "Shows whether it's active and roughly how much water is left." },
      { id: '3', x: 50, y: 72, title: 'Presence sensor', desc: "This is the part that actually makes it worth having." }
    ]
  },

  tank: {
    index: '03 / 06',
    tag: 'Home build',
    title: 'Smart Tank Manager',
    image: 'images/hardware/tank-dashboard.jpg',
    summary: "Watches the water level in both the overhead tank and the ground sump, and decides on its own when the pump should run — the important part being it refuses to run the pump if the sump's too low.",
    story: "This is the build I trust the most, because I built it out of genuine frustration — pumps burning out from running dry, or tanks overflowing onto the terrace because nobody was watching. Two ultrasonic sensors keep track of both tanks, a 7\" panel shows the live numbers, and the same data's reachable from a website so I can check it without walking up to the terrace. The dry-run cutoff is the one piece of logic I never let anyone talk me into loosening, even when it's inconvenient.",
    highlights: [
      "If the sump's too low, the pump stays off — full stop, no override that skips this check.",
      "7\" panel near the tank shows both levels live, plus a manual switch if I want to run it myself.",
      "Same numbers are visible from a browser, anywhere — mostly so I stop climbing to the terrace to check."
    ],
    whatsappMsg: "Hi Alan, the tank manager setup on your site looks like exactly what I need — can we talk about doing one for my place?",
    ctaLabel: "Ask me about this build",
    hotspots: [
      { id: '1', x: 57, y: 46, title: 'Overhead tank reading', desc: "Ultrasonic sensor, updated every few seconds." },
      { id: '2', x: 67, y: 46, title: 'Ground sump reading', desc: "This is the one the dry-run cutoff actually watches." },
      { id: '3', x: 57, y: 59, title: 'Pump status', desc: "Running, standby, or cut off — shown plainly, no icons to decode." },
      { id: '4', x: 68, y: 59, title: 'Auto / manual switch', desc: "For the rare day I want to override it myself." }
    ]
  },

  outdoor: {
    index: '04 / 06',
    tag: 'Outdoor build',
    title: 'Smart Outdoor Light',
    image: 'images/hardware/outdoor-lighting.jpg',
    summary: "Follows sunrise and sunset on its own, and wakes up for movement at night — so it's never the light that's on all afternoon or the one that's dark exactly when someone's walking up to the gate.",
    story: "Outdoor lights on a manual switch always end up wrong — on at noon, forgotten at night. This one works out roughly when dusk and dawn are and follows that schedule automatically, with a motion sensor for anyone walking past after dark. There's a manual override too, for the odd evening I want it on regardless.",
    highlights: [
      "Follows dusk and dawn on its own — I don't touch the schedule once it's set.",
      "Motion sensor wakes it up for anyone approaching at night, then it settles back down.",
      "Manual override from the dashboard for evenings I want it on the whole time."
    ],
    whatsappMsg: "Hi Alan, saw the outdoor light setup on your site — could you build one for my place?",
    ctaLabel: "Ask me about this build",
    hotspots: [
      { id: '1', x: 31, y: 70, title: 'The bulb', desc: "Standard fitting — the smart part is entirely in the timing logic." },
      { id: '2', x: 64, y: 40, title: 'Wall fixture', desc: "Just a regular outdoor sconce, nothing custom-built here." },
      { id: '3', x: 64, y: 65, title: 'Motion sensor', desc: "Wakes the light for anyone walking up after dark." }
    ]
  },

  theatre: {
    index: '05 / 06',
    tag: 'Audio build',
    title: '5.1 Home Theatre, Auto-Tuned',
    image: 'images/hardware/theatre-51.jpg',
    summary: "A 500W 5.1 setup where a microcontroller handles the room correction instead of me fiddling with an equalizer every time the room or the source changes.",
    story: "Most home setups sound boomy in a concrete room, and dialogue gets buried under bass. I wired in a microcontroller that listens to the room and adjusts tone and volume live, so I'm not manually EQ-ing every time I switch from a movie to music. Got it tuned closer to what the higher-end setups do out of the box, mostly through a lot of evenings listening critically and adjusting by ear rather than any single clever trick.",
    highlights: [
      "500W across five satellites and a sub — enough to fill the room without distorting.",
      "Room correction adjusts live rather than needing a manual EQ pass every time something changes.",
      "A couple of presets for different kinds of listening — dialogue-heavy vs. bass-heavy, roughly."
    ],
    whatsappMsg: "Hi Alan, the 5.1 auto-tuned setup on your site caught my eye — could we talk about building one for my place?",
    ctaLabel: "Ask me about this build",
    hotspots: [
      { id: '1', x: 50, y: 45, title: 'Subwoofer', desc: "Handles the low end, tuned to avoid the boomy concrete-room problem." },
      { id: '2', x: 50, y: 76, title: 'Centre channel', desc: "Where most of the dialogue-clarity tuning actually happened." },
      { id: '3', x: 28, y: 60, title: 'Left front / surround', desc: "Nothing exotic — decent satellites, properly placed." },
      { id: '4', x: 72, y: 60, title: 'Right front / surround', desc: "Mirrors the left channel for a balanced stage." }
    ]
  },

  student: {
    index: '06 / 06',
    tag: 'For students',
    title: 'Student Electronics Projects',
    image: 'images/hardware/student-projects.jpg',
    summary: "If you're stuck on an ESP32, Arduino, or robotics project for school or college, I'll build it properly and actually explain how it works — so you're not standing in front of a review panel unable to answer a basic question about your own project.",
    story: "I remember what it's like being handed a project brief with no idea where to start, so I take these on at a reasonable rate — clean breadboard or PCB work, working firmware, and a walkthrough of the circuit so you understand it well enough to defend it, not just submit it.",
    highlights: [
      "Working hardware and code, not just a diagram — you get something that actually runs.",
      "I walk you through the circuit so you can answer questions in your review, not just hand it in.",
      "Priced with students in mind — message me with your deadline and I'll tell you honestly if it's doable."
    ],
    whatsappMsg: "Hi Alan, I'm a student and need help with an electronics project for school/college.",
    ctaLabel: "Tell me about your project",
    hotspots: [
      { id: '1', x: 42, y: 68, title: 'The core circuit', desc: "ESP32 or Arduino, wired properly — no loose jumper wires held together with hope." },
      { id: '2', x: 56, y: 68, title: 'Display / sensors', desc: "Whatever the project calls for — live readings shown clearly." },
      { id: '3', x: 63, y: 50, title: 'Outputs', desc: "LEDs, relays, motors — whatever the brief needs." },
      { id: '4', x: 75, y: 22, title: 'Actually tested', desc: "Bench-tested before it comes anywhere near your review panel." }
    ]
  }
};

/* ---------------- Build Engine & Switcher ---------------- */
let currentBuildKey = 'ambient';

function initBuildEngine() {
  const dockBtns = document.querySelectorAll('.dock-btn');
  dockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const buildKey = btn.getAttribute('data-build');
      if (buildKey && buildKey !== currentBuildKey) {
        switchBuild(buildKey);
      }
    });
  });

  renderBuild(currentBuildKey);
}

function switchBuild(key) {
  if (!BUILDS[key]) return;
  currentBuildKey = key;

  document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.getAttribute('data-build') === key);
  });

  const card = document.getElementById('photoCard');
  const hotspotsLayer = document.getElementById('hotspotsLayer');

  card.style.opacity = '0';
  card.style.transform = 'scale(0.96) translateY(10px)';
  hotspotsLayer.style.opacity = '0';

  setTimeout(() => {
    renderBuild(key);
    card.style.opacity = '1';
    card.style.transform = 'scale(1) translateY(0)';
    hotspotsLayer.style.opacity = '1';
    triggerSweep();
  }, 180);
}

function renderBuild(key) {
  const data = BUILDS[key];
  if (!data) return;

  const mainImg = document.getElementById('mainImg');
  if (mainImg) {
    mainImg.src = data.image;
    mainImg.alt = data.title;
  }

  const hotspotsLayer = document.getElementById('hotspotsLayer');
  hotspotsLayer.innerHTML = data.hotspots.map(h => `
    <div class="pin-node" style="left: ${h.x}%; top: ${h.y}%;" data-title="${h.title}" data-desc="${h.desc}">
      <div class="pin-dot">${h.id}</div>
      <div class="pin-pulse-ring"></div>
    </div>
  `).join('');

  document.getElementById('dossierTag').textContent = data.tag;
  document.getElementById('dossierIndex').textContent = data.index;
  document.getElementById('dossierTitle').textContent = data.title;
  document.getElementById('dossierSummary').textContent = data.summary;
  document.getElementById('dossierStory').textContent = data.story;

  document.getElementById('dossierHighlights').innerHTML = data.highlights.map(item => `
    <li>${item}</li>
  `).join('');

  const waBtn = document.getElementById('whatsappOrderBtn');
  const waText = document.getElementById('orderBtnText');
  if (waBtn) {
    const encoded = encodeURIComponent(data.whatsappMsg);
    waBtn.href = `https://wa.me/916282406091?text=${encoded}`;
    waText.textContent = data.ctaLabel || 'Ask me about this build';
  }

  initHotspotTooltips();
}

/* ---------------- Hotspot Tooltip Handling ---------------- */
function initHotspotTooltips() {
  const popover = document.getElementById('pinPopover');
  const titleEl = document.getElementById('popoverTitle');
  const descEl = document.getElementById('popoverDesc');
  const pinNodes = document.querySelectorAll('.pin-node');

  pinNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const title = node.getAttribute('data-title');
      const desc = node.getAttribute('data-desc');
      if (!title || !desc) return;

      titleEl.textContent = title;
      descEl.textContent = desc;

      const rect = node.getBoundingClientRect();
      popover.style.left = `${Math.min(window.innerWidth - 260, rect.right + 12)}px`;
      popover.style.top = `${rect.top - 10}px`;
      popover.classList.add('is-visible');
    });

    node.addEventListener('mouseleave', () => {
      popover.classList.remove('is-visible');
    });
  });
}

/* ---------------- Idle motion: organic drift (dual sine waves) + light sweep + mouse parallax ----------------
   Replaces the old single-keyframe "bob" with a layered, non-repeating-feeling motion:
   two independent sine waves (different periods) drive rotation, a third drives a very
   slight scale "breathing" — and mouse movement blends on top rather than overriding it. */
function initIdleMotion() {
  const viewport = document.getElementById('hwViewport');
  const assembly = document.getElementById('hwCardAssembly');
  if (!viewport || !assembly) return;

  let mouseRotX = 0, mouseRotY = 0;
  let targetMouseRotX = 0, targetMouseRotY = 0;
  const start = performance.now();

  viewport.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth * 0.3;
    const centerY = window.innerHeight * 0.5;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;
    targetMouseRotY = deltaX * 7;
    targetMouseRotX = -deltaY * 6;
  });
  viewport.addEventListener('mouseleave', () => {
    targetMouseRotX = 0;
    targetMouseRotY = 0;
  });

  function tick(now) {
    const t = (now - start) / 1000;

    // three independent-period sine waves so the motion never quite repeats on a short loop
    const driftY = Math.sin(t * 0.42) * 9 + Math.sin(t * 0.17 + 1.3) * 4;
    const rotX = Math.sin(t * 0.31 + 0.6) * 1.6 + Math.sin(t * 0.11) * 0.8;
    const rotY = Math.sin(t * 0.23 + 2.1) * 2.4;
    const breathe = 1 + Math.sin(t * 0.27) * 0.008;

    // ease the mouse-driven rotation toward its target for a smooth blend with idle drift
    mouseRotX += (targetMouseRotX - mouseRotX) * 0.06;
    mouseRotY += (targetMouseRotY - mouseRotY) * 0.06;

    assembly.style.transform =
      `translateY(${driftY}px) rotateX(${rotX + mouseRotX}deg) rotateY(${rotY + mouseRotY}deg) scale(${breathe})`;

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // periodic light-sweep glint across the card, staggered so it doesn't feel metronomic
  function scheduleSweep() {
    const delay = 5200 + Math.random() * 4000;
    setTimeout(() => { triggerSweep(); scheduleSweep(); }, delay);
  }
  scheduleSweep();
}

/* Card light-sweep — a subtle glint that passes across the photo card.
   Called on idle timer and also right after switching builds. */
function triggerSweep() {
  const card = document.getElementById('photoCard');
  if (!card) return;
  card.classList.remove('sweep-active');
  void card.offsetWidth; // restart animation
  card.classList.add('sweep-active');
}

/* ---------------- URL Deep Link Handler (?build=ambient) ---------------- */
function checkUrlBuildParam() {
  const params = new URLSearchParams(window.location.search);
  const build = params.get('build');
  if (build && BUILDS[build]) {
    switchBuild(build);
  }
}
