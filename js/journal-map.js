/**
 * Journey Map Engine — Natural Personal Trip Logs
 * Pan/Zoom, Waypoints, Carousel & Honest Notes
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMapNavigation();
  initWaypoints();
  initModalCarousel();
  initPhotoLightbox();
  initFilters();

  // Auto-focus and open spot log if passed in URL query param: journal-map?spot=chimmini
  const urlParams = new URLSearchParams(window.location.search);
  const spotParam = urlParams.get('spot') || (window.location.hash ? window.location.hash.replace('#', '') : null);
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  if (spotParam && WAYPOINT_DATA[spotParam]) {
    setTimeout(() => {
      focusOnSpot(spotParam);
      setTimeout(() => {
        openSpotLog(spotParam);
      }, 450);
    }, 200);
  }
});

/* ---------------- Theme Toggle (synced with main site) ---------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('alan-theme');
  // Always default to daymode ('light') unless user manually toggled previously
  root.setAttribute('data-theme', stored || 'light');


  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('alan-theme', next);
    });
  }
}

/* ---------------- Genuine Trip Notes Data ---------------- */
const WAYPOINT_DATA = {
  chokramudi: {
    title: "Chokramudi Peak (Trekking)",
    tag: "Trek",
    when: "February 2026",
    paragraphs: [
      "Chokramudi doesn't do gentle inclines — it's steep from the first step and stays that way, which is either character-building or just cruel, depending on how your knees are feeling that day.",
      "Rode up with three friends the evening before, grabbed a stay nearby, and started the climb early — smart move, since by mid-climb the sun was doing its best to end us. Multiple terrain changes on the way up (rock, grass, more rock) kept things interesting in a way that mostly meant \"don't look down.\" Slow and steady actually works here — anyone who sprints the first stretch regrets it by the second. The summit view, though, genuinely earns the suffering: Kolukkumalai, Meesapulimala, and Anamudi all visible from up top, which is the kind of payoff that makes you forget your legs are filing a complaint."
    ],
    mapLinks: [
      { label: "Chokramudi Trek", url: "https://maps.app.goo.gl/2P9SNgUBj5XYMnDU9" }
    ],
    footnote: "Steep enough to question your fitness, worth it for the summit view",
    slides: [
      {
        tag: "Summit view",
        image: "images/journal/chokramudi/ch3.webp",
        caption: "Kolukkumalai, Meesapulimala, and Anamudi, all from one spot."
      },
      {
        tag: "The climb",
        image: "images/journal/chokramudi/ch1.webp",
        caption: "One of the steeper stretches on the way up."
      },
      {
        tag: "Almost there",
        image: "images/journal/chokramudi/ch2.webp",
        caption: "Terrain shifting again near the top."
      },
      {
        tag: "Rhododendron, uninvited but photogenic",
        image: "images/journal/chokramudi/ch4.webp",
        caption: "A wild rhododendron that insisted on being photographed."
      }
    ]
  },

  "gap-road": {
    title: "Munnar & Gap Road",
    tag: "High range",
    when: "Last visited June 2026",
    paragraphs: [
      "Munnar's tea plantations have a way of making you forget you have a job, and Gap Road specifically seems designed to slow your brain down whether you want it to or not.",
      "Been here before on two wheels, this time by car — different pace, same effect. Mornings here are properly foggy and properly cold, the kind of cold that makes a plate of hot noodles from a roadside Gap Road stall feel like a genuine life event. The tea plantations do most of the emotional work here; there's something about all that green stretching into fog that resets whatever mental clutter you rode in with."
    ],
    mapLinks: [
      { label: "Munnar", url: "https://maps.app.goo.gl/zSqKeQ3Nsw69Ehvp8" },
      { label: "Gap Road", url: "https://maps.app.goo.gl/qKuAyC5fn86nmuJx9" }
    ],
    footnote: "Rode with friends · Also arrived once by car, which doesn't count as cheating",
    slides: [
      {
        tag: "Tea and fog",
        image: "images/journal/munnar/mg1.webp",
        caption: "Gap Road's plantations, mid-morning haze."
      },
      {
        tag: "Cold enough for noodles",
        image: "images/journal/munnar/mg2.webp",
        caption: "The roadside stop that saved the morning."
      },
      {
        tag: "More tea, more fog",
        image: "images/journal/munnar/mg3.webp",
        caption: "Because one photo of this view was never enough."
      },
      {
        tag: "Two bikes, one stop",
        image: "images/journal/munnar/mg4.webp",
        caption: "Parked up with a friend, previous visit."
      }
    ]
  },

  inchathotti: {
    title: "Mamalakandam & Inchathotti Hanging Bridge",
    tag: "Solo ride",
    when: "December 2023",
    paragraphs: [
      "Mamalakandam is deep-forest Kerala at its most theatrical — thick tree cover, mist that doesn't burn off until well past sunrise, and a silence that makes every twig-snap sound personal.",
      "Left home before the sun did, which in hindsight was either brave or deeply questionable — riding solo through a pitch-dark forest road with nothing but a headlight and my own imagination working overtime is not for the faint of heart. Every shadow was definitely a wild elephant. It wasn't. Reached the hanging bridge just as the fog was lifting, and the view made the mild cardiac event on the way in completely worth it. Parked the bike on top of an off-road hill afterward just to sit there a while — no plan, no rush, just forest silence and the smug satisfaction of having survived my own nerves."
    ],
    mapLinks: [
      { label: "Mamalakandam", url: "https://maps.app.goo.gl/8LQL3yJT9R7ErU9XA" },
      { label: "Inchatotty Hanging Bridge", url: "https://maps.app.goo.gl/SGCD5Ci5wuMFiTeu5" }
    ],
    footnote: "Solo run · No one to blame for getting spooked but myself",
    slides: [
      {
        tag: "Suspension bridge, post-fog",
        image: "images/journal/inchathotti/mm1.webp",
        caption: "The hanging bridge, right as the mist finally cleared."
      },
      {
        tag: "Parked with a view",
        image: "images/journal/inchathotti/mm2.webp",
        caption: "Bike parked on the off-road hilltop, mid-ride pause."
      },
      {
        tag: "Forest, pre-dawn",
        image: "images/journal/inchathotti/mm3.webp",
        caption: "Mamalakandam's tree line before sunrise properly arrived."
      },
      {
        tag: "Still forest, still spooky",
        image: "images/journal/inchathotti/mm4.webp",
        caption: "Same forest, slightly less spooky in daylight."
      }
    ]
  },

  meeshapulimala: {
    title: "Meeshapulimala",
    tag: "Peak trek",
    when: "December 31, 2025",
    paragraphs: [
      "Meesapulimala is the kind of place that makes \"second highest peak in South India\" feel like an understatement — it's less a destination and more a separate atmosphere entirely.",
      "Went with three friends, stayed at a KDFC-run mansion the night before — clean rooms, decent food, and a genuinely good night's sleep before what turned out to be a long trek the next day. The Shola grasslands up here are also home to the Nilgiri tahr, a stocky, sure-footed mountain goat found almost nowhere else on Earth outside these high-altitude grasslands — spotting one mid-trek felt like the mountain personally approving of the effort. Ringing in the new year at that altitude, with that view, is hard to describe without sounding like a greeting card — so I won't try too hard. Magical is overused. It still applies here."
    ],
    mapLinks: [
      { label: "Meeshapulimala", url: "https://maps.app.goo.gl/ywoQivXs1H5bfEAx7" },
      { label: "KFDC Office (Meeshapulimala)", url: "https://maps.app.goo.gl/P9atEzuK8GbkgZqr5" }
    ],
    footnote: "Rode in with 3 friends · Stayed at the KDFC mansion, New Year's trek",
    slides: [
      {
        tag: "Grasslands, endless",
        image: "images/journal/meesapulimala/mp1.webp",
        caption: "Shola grassland stretching toward the horizon."
      },
      {
        tag: "The long trek",
        image: "images/journal/meesapulimala/mp2.webp",
        caption: "Somewhere in the middle of a genuinely long climb."
      },
      {
        tag: "Nilgiri tahr, unbothered",
        image: "images/journal/meesapulimala/mp3.webp",
        caption: "One of the mountain's resident tahr, mid-graze."
      },
      {
        tag: "New Year, new altitude",
        image: "images/journal/meesapulimala/mp4.webp",
        caption: "The view that made the whole trek worth it."
      }
    ]
  },

  panchalimedu: {
    title: "Panchalimedu",
    tag: "Viewpoint",
    when: "January 2026",
    paragraphs: [
      "Panchalimedu is one of those stops that sneaks up on you — you're technically just passing through en route to Vagamon, and then suddenly you're standing at a viewpoint with genuine mythological weight behind it.",
      "The place is tied to Mahabharata legend — locals will tell you it's linked to the Pandavas' exile, which adds a strange gravity to what is otherwise just a really good spot for photos. Calm, quiet, and criminally photogenic — the kind of stop that turns a five-minute break into a twenty-minute photoshoot without anyone planning it that way."
    ],
    mapLinks: [
      { label: "Panchalimedu", url: "https://maps.app.goo.gl/uh36Qwu5M5kugHFr8" }
    ],
    footnote: "Rode with friends · Quick stop that turned into the highlight of the ride",
    slides: [
      {
        tag: "The viewpoint",
        image: "images/journal/panchalimedu/pm1.webp",
        caption: "Panchalimedu's main lookout, mid-afternoon light."
      },
      {
        tag: "Heritage ground",
        image: "images/journal/panchalimedu/pm2.webp",
        caption: "The spot tied to local Mahabharata legend."
      },
      {
        tag: "Just passing through",
        image: "images/journal/panchalimedu/pm3.webp",
        caption: "Which is how every good detour starts."
      },
      {
        tag: "More viewpoint",
        image: "images/journal/panchalimedu/pm4.webp",
        caption: "Because one photo wasn't enough."
      },
      {
        tag: "Golden hour, unplanned",
        image: "images/journal/panchalimedu/pm5.webp",
        caption: "The light that turned a stop into a shoot."
      }
    ]
  },

  vagamon: {
    title: "Vagamon & Camping",
    tag: "Camping",
    when: "Monthly-ish, ongoing",
    paragraphs: [
      "Vagamon has become the default answer whenever the three of us need to disappear for a weekend — pine forests, rolling meadows, and just enough remoteness to feel like an actual escape without needing an entire week off.",
      "This has turned into something close to a monthly ritual, which still makes us laugh a little — \"we're doing this again?\" followed by immediately packing raw vegetables and instant noodles into a bag anyway. Bike if the budget allows, car if it doesn't; either way we're usually rolling in Saturday evening, cooking over a fire at our tent site on the mountain, and waking up to Sunday morning fog before heading back that evening. This round also took us through Ilaveezhapunchira — a crater-like valley locals call the \"meadow that never floods,\" oddly beautiful in an eerie sort of way — and Illikal Kallu, a massive rock formation with a genuinely vertigo-inducing viewpoint at the top. One word of warning that never gets old: leeches. Vagamon's undergrowth does not care about your ankles."
    ],
    mapLinks: [
      { label: "Vagamon", url: "https://maps.app.goo.gl/F9qB9BYMYb19YAmC7" },
      { label: "S Valavu (Vagamon)", url: "https://maps.app.goo.gl/fmZ9KqvQGDtXJpW29" }
    ],
    footnote: "Rode/drove with the usual 3 · Saturday to Sunday, cooked on-site, leech count: undisclosed",
    slides: [
      {
        tag: "The tent, pre-chaos",
        image: "images/journal/vagamon/vg1.webp",
        caption: "Set up before the cooking fire took over."
      },
      {
        tag: "Cooking on the mountain",
        image: "images/journal/vagamon/vg2.webp",
        caption: "Instant noodles have never tasted better."
      },
      {
        tag: "Fog, morning after",
        image: "images/journal/vagamon/vg3.webp",
        caption: "Sunday morning at the campsite."
      },
      {
        tag: "Ilaveezhapunchira",
        image: "images/journal/vagamon/vg4.webp",
        caption: "The valley that supposedly never floods."
      },
      {
        tag: "Illikal Kallu, from the top",
        image: "images/journal/vagamon/vg5.webp",
        caption: "The viewpoint that tests your fear of heights."
      }
    ]
  },

  varkala: {
    title: "Varkala",
    tag: "Coast",
    when: "June 2025",
    paragraphs: [
      "Varkala's whole identity is \"cliffside beach town that refuses to take itself too seriously\" — dramatic red cliffs dropping straight into the Arabian Sea, and a nightlife scene that's earned it the \"mini Goa\" label fair and square.",
      "Took the train down with family this time, which meant actual scenery instead of watching the road — the stretch through Kottayam is solid green the entire way, easily one of the better train rides in the state. Booked a room for two nights on a weekday specifically to dodge the weekend crowd, and it worked — clean beach, quiet cliffs, and just enough nightlife buzz in the evenings to remind you you're still on a holiday, not a retreat. A proper change of pace from the usual routine — pure beach-brain for 48 hours."
    ],
    mapLinks: [
      { label: "Varkala", url: "https://maps.app.goo.gl/RnqKcUAqBjkpV8LP9" }
    ],
    footnote: "Went with family · Two nights, weekday, zero regrets",
    slides: [
      {
        tag: "The cliffs",
        image: "images/journal/varkala/vk1.webp",
        caption: "Varkala's signature red cliffline, late afternoon."
      },
      {
        tag: "Beach, uncrowded",
        image: "images/journal/varkala/vk2.webp",
        caption: "The payoff for choosing a weekday."
      },
      {
        tag: "Train in, greenery all the way",
        image: "images/journal/varkala/vk3.webp",
        caption: "The Kottayam stretch, worth the window seat."
      },
      {
        tag: "Evening by the coast",
        image: "images/journal/varkala/vk4.webp",
        caption: "Varkala's after-dark side, minus the chaos."
      }
    ]
  },

  vaalparai: {
    title: "Vaalparai",
    tag: "Tamil Nadu",
    when: "May 2025",
    paragraphs: [
      "Vaalparai sits up in the Anamalai hills like it's daring you to make the trip — hairpin bends, tea estates, and a border crossing into a completely different rhythm of life, all in one ride.",
      "Longest single-day ride I've ever done, solo, no overnight stop — just Vaalparai and back, returning via Pollachi on the Tamil Nadu side. People call it a \"seventh heaven\" kind of place and for once the hype held up — the roads, the views, the whole Tamil Nadu roadside-culture shift (different food, different pace, equally good) made the ride out feel effortless. The ride back is where reality caught up with me — turns out covering that much distance solo in a day catches up with your body whether your brain enjoyed itself or not."
    ],
    mapLinks: [
      { label: "Vaalparai", url: "https://maps.app.goo.gl/jwcEUL7MnMzK2yco9" }
    ],
    footnote: "Solo ride · One day, there and back, questionable life choices regarding rest stops",
    slides: [
      {
        tag: "Anamalai hills",
        image: "images/journal/vaalparai/vp1.webp",
        caption: "The hill views that make the long ride worth it."
      },
      {
        tag: "Bike, borrowed view",
        image: "images/journal/vaalparai/vp2.webp",
        caption: "Parked up somewhere too scenic to ride past."
      },
      {
        tag: "Tea country, Tamil Nadu side",
        image: "images/journal/vaalparai/vp3.webp",
        caption: "A different state, a similar green."
      },
      {
        tag: "The long way back",
        image: "images/journal/vaalparai/vp4.webp",
        caption: "Somewhere on the return leg, tired but happy."
      }
    ]
  }
};

/* ---------------- Map Pan & Zoom Engine ---------------- */
let mapState = {
  x: 0,
  y: 0,
  scale: 1,
  minScale: 0.65,
  maxScale: 2.5,
  isDragging: false,
  startX: 0,
  startY: 0
};

function initMapNavigation() {
  const viewport = document.getElementById('mapViewport');
  const surface = document.getElementById('mapSurface');
  if (!viewport || !surface) return;

  // Set Home // Kochi as initial default view
  focusOnHome(false);

  // RAF rendering loop for 120Hz/60Hz latency-free touch tracking
  let isRafScheduled = false;
  function scheduleUpdate() {
    if (!isRafScheduled) {
      isRafScheduled = true;
      requestAnimationFrame(() => {
        surface.style.transform = `translate3d(${mapState.x}px, ${mapState.y}px, 0) scale(${mapState.scale})`;
        isRafScheduled = false;
      });
    }
  }

  // Mouse Drag Events
  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.waypoint-pin') || e.target.closest('button')) return;
    surface.style.transition = 'none';
    mapState.isDragging = true;
    mapState.startX = e.clientX - mapState.x;
    mapState.startY = e.clientY - mapState.y;
  });

  window.addEventListener('mousemove', (e) => {
    if (!mapState.isDragging) return;
    mapState.x = e.clientX - mapState.startX;
    mapState.y = e.clientY - mapState.startY;
    scheduleUpdate();
  }, { passive: true });

  window.addEventListener('mouseup', () => {
    mapState.isDragging = false;
  });

  // Touch Events (High-Performance 1-finger Pan & Precise Midpoint Pinch-Zoom)
  let touchStartDist = 0;
  let initialScale = 1;
  let pinchWorldX = 0;
  let pinchWorldY = 0;

  viewport.addEventListener('touchstart', (e) => {
    if (e.target.closest('.waypoint-pin') || e.target.closest('button')) return;
    // Clear any lingering CSS transition immediately for 0ms touch latency
    surface.style.transition = 'none';

    if (e.touches.length === 1) {
      mapState.isDragging = true;
      mapState.startX = e.touches[0].clientX - mapState.x;
      mapState.startY = e.touches[0].clientY - mapState.y;
    } else if (e.touches.length === 2) {
      mapState.isDragging = false;
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      touchStartDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
      initialScale = mapState.scale;

      const rect = viewport.getBoundingClientRect();
      const midX = (t0.clientX + t1.clientX) / 2 - rect.left;
      const midY = (t0.clientY + t1.clientY) / 2 - rect.top;

      // Pin the map coordinate directly under the midpoint between fingers
      pinchWorldX = (midX - mapState.x) / initialScale;
      pinchWorldY = (midY - mapState.y) / initialScale;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && mapState.isDragging) {
      mapState.x = e.touches[0].clientX - mapState.startX;
      mapState.y = e.touches[0].clientY - mapState.startY;
      scheduleUpdate();
    } else if (e.touches.length === 2 && touchStartDist > 0) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const currentDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
      if (currentDist === 0) return;

      const rect = viewport.getBoundingClientRect();
      const currentMidX = (t0.clientX + t1.clientX) / 2 - rect.left;
      const currentMidY = (t0.clientY + t1.clientY) / 2 - rect.top;

      const newScale = Math.min(Math.max(initialScale * (currentDist / touchStartDist), mapState.minScale), mapState.maxScale);

      // Keep (pinchWorldX, pinchWorldY) precisely anchored at (currentMidX, currentMidY)
      mapState.x = currentMidX - pinchWorldX * newScale;
      mapState.y = currentMidY - pinchWorldY * newScale;
      mapState.scale = newScale;

      scheduleUpdate();
    }
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (e.touches.length === 1) {
      // Finger lifted after pinch: seamlessly transition to 1-finger pan without position jump
      mapState.isDragging = true;
      mapState.startX = e.touches[0].clientX - mapState.x;
      mapState.startY = e.touches[0].clientY - mapState.y;
      touchStartDist = 0;
    } else if (e.touches.length === 0) {
      mapState.isDragging = false;
      touchStartDist = 0;
    }
  }, { passive: true });

  // Scroll Wheel Zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    surface.style.transition = 'none';
    const zoomDelta = e.deltaY * -0.0015;
    const oldScale = mapState.scale;
    const newScale = Math.min(Math.max(oldScale + zoomDelta, mapState.minScale), mapState.maxScale);

    const rect = viewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    mapState.x -= (mouseX - mapState.x) * (newScale / oldScale - 1);
    mapState.y -= (mouseY - mapState.y) * (newScale / oldScale - 1);
    mapState.scale = newScale;

    scheduleUpdate();
  }, { passive: false });

  // Zoom & Point/Recenter Buttons
  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    smoothZoom(1.25);
  });

  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    smoothZoom(0.8);
  });

  // Point / Recenter Button (Centers on Home // Kochi)
  document.getElementById('btnZoomReset')?.addEventListener('click', () => {
    focusOnHome(true);
  });

  function smoothZoom(factor) {
    const rect = viewport.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const oldScale = mapState.scale;
    const newScale = Math.min(Math.max(oldScale * factor, mapState.minScale), mapState.maxScale);

    mapState.x -= (centerX - mapState.x) * (newScale / oldScale - 1);
    mapState.y -= (centerY - mapState.y) * (newScale / oldScale - 1);
    mapState.scale = newScale;

    surface.style.transition = 'transform 0.4s cubic-bezier(0.22, 0.68, 0.24, 1)';
    surface.style.transform = `translate3d(${mapState.x}px, ${mapState.y}px, 0) scale(${mapState.scale})`;
    setTimeout(() => {
      surface.style.transition = '';
    }, 420);
  }
}

// Center view on Home // Kochi Basecamp
function focusOnHome(smooth = true) {
  const viewport = document.getElementById('mapViewport');
  const surface = document.getElementById('mapSurface');
  if (!viewport || !surface) return;

  const rect = viewport.getBoundingClientRect();
  const homeX = 440;
  const homeY = 600;
  const targetScale = window.innerWidth < 768 ? 0.95 : 1.0;

  mapState.scale = targetScale;
  mapState.x = rect.width / 2 - homeX * mapState.scale;
  mapState.y = rect.height / 2 - homeY * mapState.scale;

  if (smooth) {
    surface.style.transition = 'transform 0.6s cubic-bezier(0.22, 0.68, 0.24, 1)';
    surface.style.transform = `translate3d(${mapState.x}px, ${mapState.y}px, 0) scale(${mapState.scale})`;
    setTimeout(() => {
      surface.style.transition = '';
    }, 650);
  } else {
    surface.style.transition = '';
    surface.style.transform = `translate3d(${mapState.x}px, ${mapState.y}px, 0) scale(${mapState.scale})`;
  }
}

// Center view on specific coordinate / spot
function focusOnSpot(spotKey) {
  const viewport = document.getElementById('mapViewport');
  const surface = document.getElementById('mapSurface');
  const pin = document.querySelector(`.waypoint-pin[data-spot="${spotKey}"]`);
  if (!viewport || !surface || !pin) return;

  const rect = viewport.getBoundingClientRect();
  const pinLeftPercent = parseFloat(pin.style.left) / 100;
  const pinTopPercent = parseFloat(pin.style.top) / 100;

  const targetX = 2000 * pinLeftPercent;
  const targetY = 1400 * pinTopPercent;

  mapState.scale = 1.15;
  mapState.x = rect.width / 2 - targetX * mapState.scale;
  mapState.y = rect.height / 2 - targetY * mapState.scale;

  surface.style.transition = 'transform 0.6s cubic-bezier(0.22, 0.68, 0.24, 1)';
  surface.style.transform = `translate3d(${mapState.x}px, ${mapState.y}px, 0) scale(${mapState.scale})`;

  setTimeout(() => {
    surface.style.transition = '';
  }, 650);
}

/* ---------------- Waypoint Pins & Modal Interaction ---------------- */
function initWaypoints() {
  const pins = document.querySelectorAll('.waypoint-pin');
  const quickbarBtns = document.querySelectorAll('.quickbar-btn');

  pins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const spotKey = pin.getAttribute('data-spot');
      openSpotLog(spotKey);
    });
  });

  // Quickbar fast jumps
  quickbarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      focusOnSpot(target);
      setTimeout(() => openSpotLog(target), 400);
    });
  });
}

/* ---------------- Spot Modal & Carousel Engine ---------------- */
let currentSlideIndex = 0;
let currentSpotData = null;
let autoAdvanceTimer = null;
let isHoveringCarousel = false;
const AUTO_ADVANCE_DELAY = 4500;

function startAutoAdvance() {
  stopAutoAdvance();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!currentSpotData || !currentSpotData.slides || currentSpotData.slides.length <= 1) return;
  if (isHoveringCarousel) return;

  autoAdvanceTimer = setInterval(() => {
    goToSlide(currentSlideIndex + 1);
  }, AUTO_ADVANCE_DELAY);
}

function stopAutoAdvance() {
  if (autoAdvanceTimer) {
    clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
}

function restartAutoAdvance() {
  stopAutoAdvance();
  startAutoAdvance();
}

function openSpotLog(spotKey) {
  const data = WAYPOINT_DATA[spotKey];
  if (!data) return;
  currentSpotData = data;
  currentSlideIndex = 0;
  isHoveringCarousel = false;

  const overlay = document.getElementById('spotModalOverlay');
  const titleEl = document.getElementById('modalTitle');
  const tagEl = document.getElementById('modalTag');
  const whenEl = document.getElementById('modalWhen');
  const storyEl = document.getElementById('modalStory');
  const footnoteEl = document.getElementById('modalFootnote');

  titleEl.textContent = data.title;
  tagEl.textContent = data.tag;
  whenEl.textContent = data.when;

  // Build natural paragraphs with Google Map links at the end
  const parasHtml = data.paragraphs.map(p => `<p class="spot-story-p">${p}</p>`).join('');
  const mapLinksHtml = (data.mapLinks && data.mapLinks.length > 0)
    ? `<div class="spot-map-links">
        ${data.mapLinks.map(link => {
          const displayText = data.mapLinks.length > 1
            ? `Get Directions (${link.label})`
            : `Get Directions`;
          return `
            <a href="${link.url}" target="_blank" rel="noopener" class="spot-map-link">
              <span>${displayText}</span>
              <svg class="spot-map-link-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="6" y1="18" x2="18" y2="6"></line>
                <polyline points="8 6 18 6 18 16"></polyline>
              </svg>
            </a>
          `;
        }).join('')}
      </div>`
    : '';

  storyEl.innerHTML = parasHtml + mapLinksHtml;
  footnoteEl.textContent = data.footnote;

  // Build Carousel Slides
  buildCarouselSlides(data.slides);

  overlay.classList.add('is-open');
  startAutoAdvance();
}

function buildCarouselSlides(slides) {
  const track = document.getElementById('modalCarouselTrack');
  const dotsContainer = document.getElementById('modalCarouselDots');
  const prevBtn = document.getElementById('modalCarouselPrev');
  const nextBtn = document.getElementById('modalCarouselNext');
  if (!track || !dotsContainer) return;

  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  if (slides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  } else {
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
  }

  slides.forEach((slide, i) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'carousel-slide';
    const bgStyle = slide.image
      ? `background: linear-gradient(to top, rgba(18,20,26,0.85) 0%, rgba(18,20,26,0.2) 50%, rgba(18,20,26,0.05) 100%), url('${slide.image}') center/cover no-repeat;`
      : `background: ${slide.gradient || 'var(--card-bg)'};`;

    slideDiv.innerHTML = `
      <div class="carousel-slide-art" style="${bgStyle}">
        <span class="slide-overlay-tag">${slide.tag}</span>
        <p style="margin: 0.5rem 0 0; font-size: 0.88rem; opacity: 0.95; text-shadow: 0 1px 4px rgba(0,0,0,0.6);">${slide.caption}</p>
      </div>
    `;

    // Click/tap on slide opens fullscreen lightbox
    slideDiv.addEventListener('click', () => {
      openLightbox(i);
    });

    track.appendChild(slideDiv);

    if (slides.length > 1) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'is-active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
        restartAutoAdvance();
      });
      dotsContainer.appendChild(dot);
    }
  });

  updateCarouselPosition();
}

function goToSlide(index) {
  if (!currentSpotData) return;
  const total = currentSpotData.slides.length;
  currentSlideIndex = (index + total) % total;
  updateCarouselPosition();
}

function updateCarouselPosition() {
  const track = document.getElementById('modalCarouselTrack');
  const dots = document.querySelectorAll('.carousel-dot');
  if (track) {
    track.style.transform = `translate3d(-${currentSlideIndex * 100}%, 0, 0)`;
  }
  dots.forEach((d, idx) => {
    d.classList.toggle('is-active', idx === currentSlideIndex);
  });
}

function initModalCarousel() {
  const overlay = document.getElementById('spotModalOverlay');
  const card = document.getElementById('spotModalCard');
  const closeBtn = document.getElementById('spotModalClose');
  const doneBtn = document.getElementById('modalDoneBtn');
  const prevBtn = document.getElementById('modalCarouselPrev');
  const nextBtn = document.getElementById('modalCarouselNext');
  const container = document.querySelector('.spot-carousel-container');

  function closeDossier() {
    stopAutoAdvance();
    isHoveringCarousel = false;
    overlay.classList.remove('is-open');
  }

  closeBtn?.addEventListener('click', closeDossier);
  doneBtn?.addEventListener('click', closeDossier);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeDossier();
  });

  // Pause auto-advance when user is scrolling the modal notes to prevent frame drops
  card?.addEventListener('scroll', () => {
    stopAutoAdvance();
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isLightboxOpen) {
        closeLightbox();
      } else if (overlay.classList.contains('is-open')) {
        closeDossier();
      }
    } else if (isLightboxOpen) {
      if (e.key === 'ArrowLeft') {
        goToLightboxSlide(currentSlideIndex - 1);
      } else if (e.key === 'ArrowRight') {
        goToLightboxSlide(currentSlideIndex + 1);
      }
    }
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentSlideIndex - 1);
    restartAutoAdvance();
  });
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentSlideIndex + 1);
    restartAutoAdvance();
  });

  // Passive touch swipe for instant, lag-free slide transitions on mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  container?.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
      stopAutoAdvance();
    }
  }, { passive: true });

  container?.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length === 1) {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }
  }, { passive: true });

  container?.addEventListener('touchend', () => {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX < 0) {
        goToSlide(currentSlideIndex + 1);
      } else {
        goToSlide(currentSlideIndex - 1);
      }
    }
    restartAutoAdvance();
  }, { passive: true });

  // Pause on hover, resume when leaving
  container?.addEventListener('mouseenter', () => {
    isHoveringCarousel = true;
    stopAutoAdvance();
  });

  container?.addEventListener('mouseleave', () => {
    isHoveringCarousel = false;
    startAutoAdvance();
  });
}

/* ---------------- Fullscreen Photo Lightbox Engine ---------------- */
let isLightboxOpen = false;

function openLightbox(index) {
  if (!currentSpotData || !currentSpotData.slides) return;
  isLightboxOpen = true;
  stopAutoAdvance(); // Pause auto-advance timer while lightbox is open

  currentSlideIndex = (index !== undefined) ? index : currentSlideIndex;
  renderLightboxSlide(currentSlideIndex);

  const overlay = document.getElementById('photoLightboxOverlay');
  overlay?.classList.add('is-open');
}

function closeLightbox() {
  if (!isLightboxOpen) return;
  isLightboxOpen = false;
  const overlay = document.getElementById('photoLightboxOverlay');
  overlay?.classList.remove('is-open');

  // Keep underlying modal carousel in sync
  updateCarouselPosition();

  // Resume auto-advance if modal is still open
  const modalOverlay = document.getElementById('spotModalOverlay');
  if (modalOverlay?.classList.contains('is-open')) {
    startAutoAdvance();
  }
}

function goToLightboxSlide(index) {
  if (!currentSpotData || !currentSpotData.slides) return;
  const total = currentSpotData.slides.length;
  currentSlideIndex = (index + total) % total;
  renderLightboxSlide(currentSlideIndex);
  updateCarouselPosition(); // Keep underlying modal in sync
}

function renderLightboxSlide(index) {
  if (!currentSpotData || !currentSpotData.slides) return;
  const slide = currentSpotData.slides[index];
  if (!slide) return;

  const mediaWrap = document.getElementById('lightboxMediaWrap');
  const tagEl = document.getElementById('lightboxTag');
  const captionEl = document.getElementById('lightboxCaption');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (currentSpotData.slides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  } else {
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
  }

  if (tagEl) tagEl.textContent = slide.tag || '';
  if (captionEl) captionEl.textContent = slide.caption || '';

  if (mediaWrap) {
    if (slide.image) {
      mediaWrap.innerHTML = `
        <img src="${slide.image}" alt="${slide.caption || slide.tag || 'Trip photo'}" class="lightbox-img" draggable="false" />
      `;
    } else {
      mediaWrap.innerHTML = `
        <div class="lightbox-gradient-art" style="background: ${slide.gradient || 'var(--card-bg)'};"></div>
      `;
    }
  }
}

function initPhotoLightbox() {
  const overlay = document.getElementById('photoLightboxOverlay');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  if (!overlay) return;

  closeBtn?.addEventListener('click', closeLightbox);

  // Close on backdrop click (outside the image / controls)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.id === 'lightboxStage' || e.target.id === 'lightboxMediaWrap') {
      closeLightbox();
    }
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToLightboxSlide(currentSlideIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToLightboxSlide(currentSlideIndex + 1);
  });

  // Touch Swipe Gesture Support (Mobile / Touch Devices)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  overlay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    if (!isLightboxOpen) return;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const minSwipeDistance = 35;

    // Ensure horizontal swipe dominance
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX < 0) {
        // Swiped left -> next photo
        goToLightboxSlide(currentSlideIndex + 1);
      } else {
        // Swiped right -> previous photo
        goToLightboxSlide(currentSlideIndex - 1);
      }
    }
  }
}

/* ---------------- Map Category Filters ---------------- */
function initFilters() {
  const filterBtns = document.querySelectorAll('.hud-filter-btn');
  const pins = document.querySelectorAll('.waypoint-pin');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');

      pins.forEach(pin => {
        const cat = pin.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          pin.classList.remove('is-hidden');
        } else {
          pin.classList.add('is-hidden');
        }
      });
    });
  });
}
