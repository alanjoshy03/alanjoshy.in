/**
 * Hardware Lab — Clean Minimalist 65/35 Showcase Engine
 * Simple human explanations, direct WhatsApp ordering, subtle dot hotspots, and 6 featured build options.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBuildEngine();
  initParallaxStage();
  checkUrlBuildParam();
});

/* ---------------- Theme Toggle (Sync with portfolio default: light) ---------------- */
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

/* ---------------- Hardware Builds Database (6 Products) ---------------- */
const BUILDS = {
  ambient: {
    index: '01 / 06',
    tag: 'Desktop & Bias Lighting',
    title: 'Desktop Ambient Monitor Light',
    image: 'images/hardware/ambient-light.jpg',
    summary: 'Reads the exact colors on your monitor in real time and throws matching bias light across the wall behind it — making games, movies, and late-night coding sessions way easier on the eyes.',
    story: 'Commercial backlights are either overpriced, slow, or drag down your gaming frame rates with heavy background apps. I built this custom setup to read the screen instantly with zero delay, sync seamlessly with the whole desk alcove, and dim automatically when the room lights are switched off.',
    highlights: [
      '<strong>Zero Input Lag:</strong> Instant 60 FPS color sync that feels like your monitor screen extends into the room.',
      '<strong>Perimeter Wall Glow:</strong> Lights up the architectural alcove behind the desk for immersive atmospheric lighting.',
      '<strong>Auto Night Dimming:</strong> Detects ambient room light and softens brightness automatically in the dark.',
      '<strong>Custom Colors & Modes:</strong> Includes manual mood lighting modes when you just want a warm aesthetic glow.'
    ],
    whatsappMsg: "Hi Alan, I'm interested in getting the Desktop Ambient Monitor Light setup built for my desk!",
    hotspots: [
      { id: '1', x: 50, y: 48, title: 'Screen Color Sync', desc: 'Reads edge screen colors in real time with zero noticeable delay.' },
      { id: '2', x: 50, y: 15, title: 'Alcove Wall Glow', desc: 'Perimeter light strips illuminating the architectural niche.' },
      { id: '3', x: 75, y: 56, title: 'Desk Integration', desc: 'Clean, hidden wiring that integrates neatly behind the desk setup.' },
      { id: '4', x: 50, y: 82, title: 'Microcontroller Hub', desc: 'Handles high-speed serial color streaming and auto-dimming.' }
    ]
  },

  mist: {
    index: '02 / 06',
    tag: 'Home & Room Atmosphere',
    title: 'Smart Presence-Aware Mist Sprayer',
    image: 'images/hardware/mist-sprayer.jpg',
    summary: 'An intelligent desktop aroma diffuser that knows when you are in the room. It automatically turns on when you walk in, rests when you leave, and pairs with your favorite smart home voice assistants.',
    story: 'Normal aroma diffusers are annoying — they either run continuously until they run out of water, or you forget to turn them on. I designed this one to sense room presence on its own, keep a comfortable aroma schedule, and accept simple voice commands from Alexa or Google Home.',
    highlights: [
      '<strong>Room Presence Sensor:</strong> Automatically starts misting when you enter the room and sleeps when you leave.',
      '<strong>Alexa & Google Home:</strong> Turn it on/off, switch fragrance modes, or set timers with your voice.',
      '<strong>Automated Schedules:</strong> Program custom morning wake-up and evening relaxing mist routines.',
      '<strong>Multiple Scent Modes:</strong> Adjustable vapor intensity and multiple essential oil cartridge options.'
    ],
    whatsappMsg: "Hi Alan, I'm interested in the Smart Presence-Aware Mist Sprayer & Diffuser!",
    hotspots: [
      { id: '1', x: 50, y: 22, title: 'Cool Vapor Nozzle', desc: 'Generates an ultra-fine, smooth cool ultrasonic fragrance mist.' },
      { id: '2', x: 50, y: 52, title: 'Circular Display', desc: 'Shows current scent mode, fluid level, and Wi-Fi connection.' },
      { id: '3', x: 50, y: 72, title: 'Room Presence Radar', desc: 'Senses when you enter the room and turns on automatically.' },
      { id: '4', x: 50, y: 90, title: 'Smart Home Hub', desc: 'Seamlessly pairs with Amazon Alexa, Google Home, and phone app.' }
    ]
  },

  tank: {
    index: '03 / 06',
    tag: 'Home Automation',
    title: 'Smart Tank Manager Dashboard',
    image: 'images/hardware/tank-dashboard.jpg',
    summary: 'A clean kitchen wall-mounted touch console that watches your water levels 24/7. It displays live gauges for both your overhead tank and ground sump, runs the pump automatically, and strictly shuts off before tanks run dry.',
    story: 'In our homes, water pumps burning out from dry runs and tanks overflowing are constant headaches. I built this flush kitchen wall-mounted unit with a clean, unbranded interface so anyone at home can see exact tank levels at a glance with zero guesswork.',
    highlights: [
      '<strong>Dual Tank Level Gauges:</strong> Clear percentage indicators for both your overhead terrace tank and ground sump.',
      '<strong>Burnout Protection:</strong> Automatically shuts down the motor if the ground sump runs out of water.',
      '<strong>Auto / Manual Toggle:</strong> One-tap switch on the screen to switch between automatic control and manual override.',
      '<strong>Kitchen Wall Mount:</strong> Slim, modern flush-mounted unit that looks beautiful and natural in any kitchen.'
    ],
    whatsappMsg: "Hi Alan, I'd like to ask about getting the Smart Tank Manager Dashboard installed for my home!",
    hotspots: [
      { id: '1', x: 57, y: 46, title: 'Overhead Tank Gauge (85%)', desc: 'Real-time level indicator showing current water stored in the roof tank.' },
      { id: '2', x: 67, y: 46, title: 'Ground Sump Gauge (62%)', desc: 'Monitors ground well/sump with dry-run pump cutoff protection.' },
      { id: '3', x: 57, y: 59, title: 'Pump Motor Status', desc: 'Confirms whether the motor is actively running or on safe standby.' },
      { id: '4', x: 68, y: 59, title: 'Auto / Manual Switch', desc: 'Simple toggle to let the system run automatically or turn on manually.' },
      { id: '5', x: 72, y: 37, title: 'Settings & Alerts', desc: 'Configure custom low-water warning thresholds and timers.' }
    ]
  },

  outdoor: {
    index: '04 / 06',
    tag: 'Outdoor & Perimeter Lighting',
    title: 'Smart Outdoor Gate & Sitout Lighting',
    image: 'images/hardware/outdoor-lighting.jpg',
    summary: 'An intelligent outdoor lighting bundle featuring a smart gate bulb and sitout wall lamp that follow sunrise and sunset automatically on their own — waking up with a warm glow when someone walks up at night.',
    story: 'Outdoor lights are always either left on all day or forgotten when someone arrives in the dark. This system calculates exact dusk and dawn mathematically using local solar time without needing internet Wi-Fi, keeping a soft standby glow and brightening on movement.',
    highlights: [
      '<strong>Astro Solar Timing:</strong> Automatically follows sunrise and sunset without needing internet or timers.',
      '<strong>Motion Wake Sensor:</strong> Stays in low-energy standby at night and brightens automatically when someone approaches.',
      '<strong>Gate & Sitout Bundle:</strong> Includes an all-weather smart gate bulb and matching modern wall sconce.',
      '<strong>Manual Override:</strong> Can be switched on continuously for family gatherings or evening sit-outs.'
    ],
    whatsappMsg: "Hi Alan, I'm interested in the Smart Outdoor Gate & Sitout Lighting setup!",
    hotspots: [
      { id: '1', x: 31, y: 70, title: 'Smart Gate LED Bulb', desc: 'Astronomical dusk-to-dawn timed bulb with no internet required.' },
      { id: '2', x: 64, y: 40, title: 'Sitout Wall Lamp', desc: 'Modern architectural matte-black sconce with warm downward wash.' },
      { id: '3', x: 64, y: 65, title: '120° Motion Sensor', desc: 'Silent solid-state switching waking to full brightness on motion.' }
    ]
  },

  theatre: {
    index: '05 / 06',
    tag: 'Acoustics & Sound',
    title: '5.1 Home Theatre, Auto-Tuned',
    image: 'images/hardware/theatre-51.jpg',
    summary: 'A powerful 500W surround sound system with built-in acoustic auto-tuning — it measures your room acoustics and tunes itself live so movie dialogue is crystal clear and bass stays deep and tight.',
    story: 'Most home theatre setups sound boomy in concrete rooms, making dialogue hard to understand. I integrated digital sound processing that plays brief test sweeps, maps out room reflections, and automatically smooths out muddy frequencies with zero manual equalizer tuning needed.',
    highlights: [
      '<strong>500W Deep Power:</strong> Dedicated active subwoofer and 5 matching satellite channels for room-filling cinema audio.',
      '<strong>Auto Room Correction:</strong> Measures standing waves and removes muddy bass hum automatically.',
      '<strong>Crystal Clear Dialogue:</strong> Dedicated center-channel processing so movie voices are always crisp.',
      '<strong>Unbranded Minimal Design:</strong> Clean matte-black acoustic aesthetic that blends into any living room.'
    ],
    whatsappMsg: "Hi Alan, I'm interested in your 5.1 Auto-Tuned Home Theatre Sound System!",
    hotspots: [
      { id: '1', x: 50, y: 45, title: '500W Active Subwoofer', desc: 'Deep, tight low-frequency bass with dedicated internal amplification.' },
      { id: '2', x: 50, y: 76, title: 'Center Dialogue Channel', desc: 'Tuned specifically for razor-sharp, natural movie dialogue.' },
      { id: '3', x: 28, y: 60, title: 'Left Front & Surround', desc: 'Compact high-definition satellite speakers creating surround immersion.' },
      { id: '4', x: 72, y: 60, title: 'Right Front & Surround', desc: 'Wide acoustic dispersion matching studio audio standards.' }
    ]
  },

  student: {
    index: '06 / 06',
    tag: 'School & College Prototyping',
    title: 'Custom Student Electronics Projects',
    image: 'images/hardware/student-projects.jpg',
    summary: 'Custom electronics prototypes built for final year engineering students, diploma projects, and school science models — properly wired, reasonably priced, and explained from start to finish.',
    story: 'Stuck on an IoT, ESP32, Arduino, or robotics project for college or school? I take on custom prototyping jobs: clean breadboard assemblies, PCB soldering, sensor interfacing, and code writing. I will explain the entire circuit step-by-step so you understand exactly how it works for your review.',
    highlights: [
      '<strong>Complete Hardware & Code:</strong> Clean breadboard or PCB circuit, firmware code, and circuit diagram.',
      '<strong>Full Project Explanation:</strong> I explain the circuit and code so you can confidently answer questions in college reviews.',
      '<strong>Reasonable Pricing:</strong> Affordable, student-friendly pricing without compromising build quality.',
      '<strong>Fast Prototyping:</strong> Quick turnarounds for project deadlines, science fairs, and semester submissions.'
    ],
    whatsappMsg: "Hi Alan, I'm a student and need help building an electronics project for school/college!",
    hotspots: [
      { id: '1', x: 42, y: 68, title: 'Microcontroller Circuit', desc: 'ESP32 / Arduino wired cleanly with proper power regulation.' },
      { id: '2', x: 56, y: 68, title: 'Sensor & OLED Display', desc: 'Real-time telemetry showing live sensor readings on screen.' },
      { id: '3', x: 63, y: 50, title: 'LED Matrix / Actuators', desc: 'Output indicators, relays, motors, or wireless transmitters.' },
      { id: '4', x: 75, y: 22, title: 'Bench Tested & Verified', desc: 'Thoroughly tested with multimeters and oscilloscopes for reliability.' }
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

  // Update Dock active states
  document.querySelectorAll('.dock-btn').forEach(btn => {
    if (btn.getAttribute('data-build') === key) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });

  // Smooth card transition
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
  }, 180);
}

function renderBuild(key) {
  const data = BUILDS[key];
  if (!data) return;

  // 1. Main Image
  const mainImg = document.getElementById('mainImg');
  if (mainImg) {
    mainImg.src = data.image;
    mainImg.alt = data.title;
  }

  // 2. Minimal Dot Hotspots Layer
  const hotspotsLayer = document.getElementById('hotspotsLayer');
  hotspotsLayer.innerHTML = data.hotspots.map(h => `
    <div class="pin-node" style="left: ${h.x}%; top: ${h.y}%;" data-title="${h.title}" data-desc="${h.desc}">
      <div class="pin-dot">${h.id}</div>
      <div class="pin-pulse-ring"></div>
    </div>
  `).join('');

  // 3. Right 35% Panel Details
  document.getElementById('dossierTag').textContent = data.tag;
  document.getElementById('dossierIndex').textContent = data.index;
  document.getElementById('dossierTitle').textContent = data.title;
  document.getElementById('dossierSummary').textContent = data.summary;
  document.getElementById('dossierStory').textContent = data.story;

  // Highlights list
  document.getElementById('dossierHighlights').innerHTML = data.highlights.map(item => `
    <li>${item}</li>
  `).join('');

  // WhatsApp Order Button Link
  const waBtn = document.getElementById('whatsappOrderBtn');
  const waText = document.getElementById('orderBtnText');
  if (waBtn) {
    const encoded = encodeURIComponent(data.whatsappMsg);
    waBtn.href = `https://wa.me/916282406091?text=${encoded}`;
    waText.textContent = key === 'student' ? 'Discuss Your Project on WhatsApp' : 'Order / Inquire on WhatsApp';
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

/* ---------------- 3D Mouse Parallax on Showcase Stage ---------------- */
function initParallaxStage() {
  const viewport = document.getElementById('hwViewport');
  const assembly = document.getElementById('hwCardAssembly');

  if (!viewport || !assembly) return;

  viewport.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth * 0.3;
    const centerY = window.innerHeight * 0.5;

    const deltaX = (clientX - centerX) / centerX;
    const deltaY = (clientY - centerY) / centerY;

    const rotateY = deltaX * 10;
    const rotateX = -deltaY * 8;

    assembly.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
  });

  viewport.addEventListener('mouseleave', () => {
    assembly.style.transform = '';
  });
}

/* ---------------- URL Deep Link Handler (?build=ambient) ---------------- */
function checkUrlBuildParam() {
  const params = new URLSearchParams(window.location.search);
  const build = params.get('build');
  if (build && BUILDS[build]) {
    switchBuild(build);
  }
}
