/**
 * Expedition Journal Map Interactive Engine
 * Pan/Zoom, Waypoints, Ghost of Tsushima Dossiers & Image Carousels
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMapNavigation();
  initWaypoints();
  initModalCarousel();
  initFilters();
});

/* ---------------- Theme Toggle (synced with main site) ---------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('alan-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', stored || (prefersLight ? 'light' : 'dark'));

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('alan-theme', next);
    });
  }
}

/* ---------------- Waypoint Data Dictionary ---------------- */
const WAYPOINT_DATA = {
  munnar: {
    title: "Munnar & Gap Road",
    subtitle: "High Altitude Switchbacks & Rolling Tea Estates",
    category: "HIGH RANGE",
    coords: "10.0889° N, 77.0595° E",
    altitude: "1,532 M MSL",
    terrain: "Steep Hairpin Asphalt • Dense Fog • Mountain Rain",
    bikeNote: "Xpulse 4V low-end torque powered easily through 2nd gear climbs with full panniers.",
    season: "Post-Monsoon (Sept – Jan)",
    distance: "~280 km round-trip",
    dossierId: "EXPEDITION #01 // MUNNAR",
    story: "The Gap Road stretch heading toward Munnar is one of those routes that rewards early risers with wall-to-wall mist and near-empty tarmac. The Xpulse ate up the occasional gravel washout without breaking stride. Standing on the pegs through the tea garden sweepers as the temperature dropped to 14°C — this is why we ride.",
    slides: [
      {
        tag: "GAP ROAD CLIFF OVERLOOK",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.85), rgba(18,20,26,0.95))",
        caption: "Rolling cloud blanket across the Western Ghats ridge line."
      },
      {
        tag: "TEA ESTATE SWEEPERS",
        gradient: "linear-gradient(135deg, rgba(181,101,44,0.75), rgba(61,92,72,0.85))",
        caption: "Early morning damp tarmac carving through old British tea slopes."
      },
      {
        tag: "OFF-ROAD TRAIL CUT",
        gradient: "linear-gradient(135deg, rgba(27,30,39,0.85), rgba(181,101,44,0.75))",
        caption: "Loose rock fire-trail climb overlooking the valley floor."
      }
    ]
  },

  vagamon: {
    title: "Vagamon Pine Ridge",
    subtitle: "Off-Grid Pine Forest & Broken Dirt Tracks",
    category: "DIRT TRAIL",
    coords: "9.6865° N, 76.9048° E",
    altitude: "1,100 M MSL",
    terrain: "Clay Mud • Loose Pine Needles • Unpaved Ridges",
    bikeNote: "21-inch front spoked wheel made crawling over roots and rocky ledges effortless.",
    season: "October – March",
    distance: "~190 km round-trip",
    dossierId: "EXPEDITION #02 // VAGAMON",
    story: "Past the tourist belt lies a network of unpaved forest trails where cellular reception completely cuts out. We pitched camp under the tall pines just as the dusk chill set in. Waking up to the smell of damp pine needles, boiling black tea on a portable stove, and kicking the bike back to life for an early trail loop.",
    slides: [
      {
        tag: "PINE RIDGE CAMPSITE",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.9), rgba(27,30,39,0.95))",
        caption: "Isolated camp spot pitched right at the edge of the pine valley."
      },
      {
        tag: "MUD & ROOT TRAIL",
        gradient: "linear-gradient(135deg, rgba(181,101,44,0.8), rgba(27,30,39,0.9))",
        caption: "Testing the dual-sport knobbies across slippery hill descent."
      }
    ]
  },

  varkala: {
    title: "Varkala Red Cliff Overlook",
    subtitle: "Coastal Highway & Laterite Cliff Tops",
    category: "COASTAL",
    coords: "8.7379° N, 76.7163° E",
    altitude: "30 M MSL",
    terrain: "Coastal Asphalt • Sandy Side Roads • Ocean Breeze",
    bikeNote: "High cruise comfort on coastal bypass; high ground clearance helps on soft beach sand.",
    season: "November – February",
    distance: "~340 km round-trip",
    dossierId: "EXPEDITION #03 // VARKALA",
    story: "A continuous south-bound coastal ride following the edge of the Arabian Sea. The highlight is parking right above the red sedimentary cliffs as the sun dips into the ocean. The salty ocean headwind, winding coconut grove back-lanes, and the relaxed beach town evening vibe make this our favorite weekend reset.",
    slides: [
      {
        tag: "RED CLIFF SUNSET",
        gradient: "linear-gradient(135deg, rgba(217,130,74,0.85), rgba(61,92,72,0.75))",
        caption: "Panoramic Arabian Sea vista from the north cliff perch."
      },
      {
        tag: "COASTAL CORRIDOR",
        gradient: "linear-gradient(135deg, rgba(18,20,26,0.9), rgba(181,101,44,0.75))",
        caption: "Narrow beachside tarmac lined with swaying coconut palms."
      }
    ]
  },

  kovalam: {
    title: "Kovalam & South Cape",
    subtitle: "Lighthouse Rock, Coastal Bends & Southern Headlands",
    category: "COASTAL",
    coords: "8.4004° N, 76.9787° E",
    altitude: "18 M MSL",
    terrain: "Smooth Highway • Sea-spray Bends • Harbour Roads",
    bikeNote: "Crisp throttle response on the fast 4-lane southward sprint.",
    season: "All Year (Best Dec – Feb)",
    distance: "~420 km round-trip",
    dossierId: "EXPEDITION #04 // KOVALAM",
    story: "Sweeping down through the southern tip of Kerala past Vizhinjam's massive breakwaters. The view from the red-and-white striped lighthouse rocky outcrop gives a 360-degree look at the endless ocean expanse. Perfect winding corners and fresh seafood stops before heading inland.",
    slides: [
      {
        tag: "LIGHTHOUSE POINT",
        gradient: "linear-gradient(135deg, rgba(181,101,44,0.85), rgba(27,30,39,0.95))",
        caption: "Iconic red-banded beacon looking out over the surf break."
      },
      {
        tag: "HARBOUR ROADS",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.8), rgba(18,20,26,0.9))",
        caption: "Late evening cruise along the new Vizhinjam coastal bypass."
      }
    ]
  },

  dhanushkodi: {
    title: "Dhanushkodi — The Lost City",
    subtitle: "Land's End, Oceanic Highway & Historic Ghost Town",
    category: "OCEAN STRAIT",
    coords: "9.1558° N, 79.4184° E",
    altitude: "2 M MSL",
    terrain: "Straight Salt-Flat Highway • Crosswinds • Sandy Beach Bed",
    bikeNote: "Cruised straight across Pamban bridge; stable in brutal oceanic crosswinds.",
    season: "December – February",
    distance: "~920 km expedition",
    dossierId: "EXPEDITION #05 // DHANUSHKODI",
    story: "The ultimate road trip from Kerala across the border to the tip of Rameshwaram island. Crossing the Pamban railway bridge with the sea on both sides, then riding the single strip of asphalt that cuts straight through the salt flats to Arichal Munai — where the Indian Ocean meets the Bay of Bengal. The remnants of the 1964 cyclone church and railway station stand frozen in time.",
    slides: [
      {
        tag: "ARICHAL MUNAI // LAND'S END",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.9), rgba(181,101,44,0.8))",
        caption: "The terminal road point where two oceans merge in deep turquoise."
      },
      {
        tag: "GHOST TOWN RUINS",
        gradient: "linear-gradient(135deg, rgba(18,20,26,0.95), rgba(140,135,120,0.8))",
        caption: "Submerged church arches standing amidst the shifting sand dunes."
      },
      {
        tag: "PAMBAN STRAIT CROSSING",
        gradient: "linear-gradient(135deg, rgba(217,130,74,0.85), rgba(27,30,39,0.9))",
        caption: "Oceanic crosswinds on the road bridge parallel to the rail bridge."
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

  // Center the map initially around South Kerala / Munnar
  const rect = viewport.getBoundingClientRect();
  mapState.scale = window.innerWidth < 900 ? 0.75 : 1.0;
  mapState.x = (rect.width - 2000 * mapState.scale) * 0.35;
  mapState.y = (rect.height - 1400 * mapState.scale) * 0.45;
  updateTransform();

  // Mouse Drag Events
  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.waypoint-pin') || e.target.closest('button')) return;
    mapState.isDragging = true;
    mapState.startX = e.clientX - mapState.x;
    mapState.startY = e.clientY - mapState.y;
  });

  window.addEventListener('mousemove', (e) => {
    if (!mapState.isDragging) return;
    mapState.x = e.clientX - mapState.startX;
    mapState.y = e.clientY - mapState.startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    mapState.isDragging = false;
  });

  // Touch Events (Pan & Pinch-Zoom)
  let touchStartDist = 0;
  let initialScale = 1;

  viewport.addEventListener('touchstart', (e) => {
    if (e.target.closest('.waypoint-pin') || e.target.closest('button')) return;
    if (e.touches.length === 1) {
      mapState.isDragging = true;
      mapState.startX = e.touches[0].clientX - mapState.x;
      mapState.startY = e.touches[0].clientY - mapState.y;
    } else if (e.touches.length === 2) {
      mapState.isDragging = false;
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialScale = mapState.scale;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && mapState.isDragging) {
      mapState.x = e.touches[0].clientX - mapState.startX;
      mapState.y = e.touches[0].clientY - mapState.startY;
      updateTransform();
    } else if (e.touches.length === 2 && touchStartDist > 0) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const zoomFactor = currentDist / touchStartDist;
      mapState.scale = Math.min(Math.max(initialScale * zoomFactor, mapState.minScale), mapState.maxScale);
      updateTransform();
    }
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    mapState.isDragging = false;
    touchStartDist = 0;
  });

  // Scroll Wheel Zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    const oldScale = mapState.scale;
    const newScale = Math.min(Math.max(oldScale + zoomDelta, mapState.minScale), mapState.maxScale);

    // Zoom toward pointer
    const rect = viewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    mapState.x -= (mouseX - mapState.x) * (newScale / oldScale - 1);
    mapState.y -= (mouseY - mapState.y) * (newScale / oldScale - 1);
    mapState.scale = newScale;

    updateTransform();
  }, { passive: false });

  // Zoom Buttons
  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    smoothZoom(1.25);
  });

  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    smoothZoom(0.8);
  });

  document.getElementById('btnZoomReset')?.addEventListener('click', () => {
    focusOnSpot('munnar');
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
    updateTransform();
  }

  function updateTransform() {
    surface.style.transform = `translate(${mapState.x}px, ${mapState.y}px) scale(${mapState.scale})`;
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

  mapState.scale = 1.2;
  mapState.x = rect.width / 2 - targetX * mapState.scale;
  mapState.y = rect.height / 2 - targetY * mapState.scale;

  surface.style.transition = 'transform 0.6s cubic-bezier(0.22, 0.68, 0.24, 1)';
  surface.style.transform = `translate(${mapState.x}px, ${mapState.y}px) scale(${mapState.scale})`;

  setTimeout(() => {
    surface.style.transition = '';
  }, 650);
}

/* ---------------- Waypoint Pins & Modal Interaction ---------------- */
function initWaypoints() {
  const pins = document.querySelectorAll('.waypoint-pin');
  const quickbarBtns = document.querySelectorAll('.quickbar-btn');
  const toast = document.getElementById('lockedToast');
  const toastTitle = document.getElementById('lockedToastTitle');
  let toastTimer = null;

  pins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const spotKey = pin.getAttribute('data-spot');

      if (pin.classList.contains('is-locked')) {
        // Show Locked Territory Toast
        if (toastTitle) {
          const lockedNames = {
            anamalai: "Anamalai High Pass",
            silentvalley: "Silent Valley Corridor",
            kollihills: "Kolli Hills 70-Hairpin Ghat"
          };
          toastTitle.textContent = lockedNames[spotKey] || "Territory Locked";
        }
        if (toast) {
          toast.classList.add('is-shown');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 3500);
        }
        return;
      }

      openSpotDossier(spotKey);
    });
  });

  // Quickbar fast jumps
  quickbarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      focusOnSpot(target);
      setTimeout(() => openSpotDossier(target), 400);
    });
  });
}

/* ---------------- Spot Modal & Carousel Engine ---------------- */
let currentSlideIndex = 0;
let currentSpotData = null;

function openSpotDossier(spotKey) {
  const data = WAYPOINT_DATA[spotKey];
  if (!data) return;
  currentSpotData = data;
  currentSlideIndex = 0;

  const overlay = document.getElementById('spotModalOverlay');
  const titleEl = document.getElementById('modalTitle');
  const subtitleEl = document.getElementById('modalSubtitle');
  const categoryEl = document.getElementById('modalCategory');
  const coordsEl = document.getElementById('modalCoords');
  const altitudeEl = document.getElementById('modalAltitude');
  const storyEl = document.getElementById('modalStory');
  const terrainEl = document.getElementById('modalTerrain');
  const bikeNoteEl = document.getElementById('modalBikeNote');
  const seasonEl = document.getElementById('modalSeason');
  const distanceEl = document.getElementById('modalDistance');
  const dossierIdEl = document.getElementById('modalDossierId');

  titleEl.textContent = data.title;
  subtitleEl.textContent = data.subtitle;
  categoryEl.textContent = data.category;
  coordsEl.textContent = data.coords;
  altitudeEl.textContent = data.altitude;
  storyEl.textContent = data.story;
  terrainEl.textContent = data.terrain;
  bikeNoteEl.textContent = data.bikeNote;
  seasonEl.textContent = data.season;
  distanceEl.textContent = data.distance;
  dossierIdEl.textContent = data.dossierId;

  // Build Carousel Slides
  buildCarouselSlides(data.slides);

  overlay.classList.add('is-open');
}

function buildCarouselSlides(slides) {
  const track = document.getElementById('modalCarouselTrack');
  const dotsContainer = document.getElementById('modalCarouselDots');
  if (!track || !dotsContainer) return;

  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  slides.forEach((slide, i) => {
    // Slide Item
    const slideDiv = document.createElement('div');
    slideDiv.className = 'carousel-slide';
    slideDiv.innerHTML = `
      <div class="carousel-slide-art" style="background: ${slide.gradient};">
        <span class="slide-overlay-tag">${slide.tag}</span>
        <p style="margin: 0.6rem 0 0; font-size: 0.85rem; opacity: 0.9;">${slide.caption}</p>
      </div>
    `;
    track.appendChild(slideDiv);

    // Dot
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${i === 0 ? 'is-active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
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
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  }
  dots.forEach((d, idx) => {
    d.classList.toggle('is-active', idx === currentSlideIndex);
  });
}

function initModalCarousel() {
  const overlay = document.getElementById('spotModalOverlay');
  const closeBtn = document.getElementById('spotModalClose');
  const doneBtn = document.getElementById('modalDoneBtn');
  const prevBtn = document.getElementById('modalCarouselPrev');
  const nextBtn = document.getElementById('modalCarouselNext');

  function closeDossier() {
    overlay.classList.remove('is-open');
  }

  closeBtn?.addEventListener('click', closeDossier);
  doneBtn?.addEventListener('click', closeDossier);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeDossier();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeDossier();
    }
  });

  prevBtn?.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentSlideIndex + 1));
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
