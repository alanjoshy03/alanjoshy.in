/**
 * Journey Map Engine — Natural Personal Trip Logs
 * Pan/Zoom, Waypoints, Carousel & Honest Notes
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMapNavigation();
  initWaypoints();
  initModalCarousel();
  initFilters();

  // Auto-focus and open spot log if passed in URL query param: journal-map.html?spot=chimmini
  const urlParams = new URLSearchParams(window.location.search);
  const spotParam = urlParams.get('spot') || window.location.hash.replace('#', '');
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
  chimmini: {
    title: "Chimmini Wildlife Sanctuary",
    tag: "Forest reserve",
    when: "Quiet weekend run",
    paragraphs: [
      "A completely different pace from the aggressive high-range climbs. Took the narrow forest department road branching in from Thrissur — tree canopy so thick overhead that the afternoon sunlight only breaks through in golden patches across the road.",
      "Rode slow along the reservoir edge with zero engine noise, just the sound of cicadas and water lapping against the gravel banks. We stopped on the dam bridge to watch hornbills crossing between the bamboo thickets. A good reminder that not every ride needs to be about distance or speed."
    ],
    footnote: "Slow forest run • Dam reservoir and quiet canopy trails",
    slides: [
      {
        tag: "RESERVOIR ROAD",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.9), rgba(27,30,39,0.95))",
        caption: "Silent water and dense rainforest buffer on the sanctuary track."
      },
      {
        tag: "CANOPY TRAIL",
        gradient: "linear-gradient(135deg, rgba(181,101,44,0.75), rgba(61,92,72,0.85))",
        caption: "Shaded gravel road cutting through the foothills buffer zone."
      }
    ]
  },

  chokramudi: {
    title: "Chokramudi Trek",
    tag: "High range trek",
    when: "Winter weekend",
    paragraphs: [
      "A steep climb near Munnar — short in horizontal distance, but totally unforgiving in gradient. We parked the Xpulses by the roadside tea shop early in the morning and started scrambling up the rocky spine before the fog lifted.",
      "The wind near the false peak was strong enough that you had to lean your whole body into it. By the time we scrambled past the last boulders to the summit ridge, the entire valley below was laid out like a green contour map. The kind of climb where the view makes you forgive your knees for the descent."
    ],
    footnote: "Early morning push • Steeper than it looks from the road",
    slides: [
      {
        tag: "ROCKY SPINE",
        gradient: "linear-gradient(135deg, rgba(181,101,44,0.85), rgba(61,92,72,0.8))",
        caption: "Scrambling up the grassy ridge before the mid-day sun."
      },
      {
        tag: "TEA VALLEY RIDGE",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.85), rgba(18,20,26,0.95))",
        caption: "Looking down onto the Lockhart and Bison Valley slopes."
      }
    ]
  },

  meesapulimala: {
    title: "Meesapulimala Peak",
    tag: "Peak trek",
    when: "October last year",
    paragraphs: [
      "The main trip of last year — myself and the same three friends who come along for most of these. Left the bikes at the base camp near Suryanelli before daybreak, then hiked up through the rhododendron valleys as the clouds were still sitting in the hollows.",
      "Meesapulimala is one of the highest points in the Western Ghats, and the steep ridge climb is long enough that everyone stops talking for stretches of it. Standing at the peak with Tamil Nadu on one side and Kerala on the other, watching the wind push mist across the cliffs — you forget how cold your hands are."
    ],
    footnote: "Trek with the core four • Camped below Suryanelli",
    slides: [
      {
        tag: "RHODO VALLEY",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.95), rgba(181,101,44,0.75))",
        caption: "Walking through the high-altitude grasslands before sunrise."
      },
      {
        tag: "THE SUMMIT RIDGE",
        gradient: "linear-gradient(135deg, rgba(18,20,26,0.95), rgba(61,92,72,0.85))",
        caption: "Windy cliff edge looking out across the sea of clouds."
      }
    ]
  },

  munnar: {
    title: "Munnar & Gap Road",
    tag: "High range",
    when: "Early monsoon, 2024",
    paragraphs: [
      "Left Kochi around 4:30 AM before the highway traffic woke up. By the time we hit the ghat section past Kothamangalam, the temperature had dropped ten degrees and Gap Road was half fog, half wet gravel from the night's drizzle.",
      "We stopped at a tiny wooden tea shack near Devikulam that probably hasn't changed in thirty years — lukewarm parottas, very strong tea, and our riding jackets dripping all over the floor. The rear tyre slipped once on wet moss near Lockhart gap, but the Xpulse just straightened out and tracked through. Cold, soaked, completely worth the numb fingers."
    ],
    footnote: "Rode with: Jithin, Rahul & Sharon • 2 days, 1 puncture near Adimali",
    slides: [
      {
        tag: "GAP ROAD",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.85), rgba(18,20,26,0.95))",
        caption: "Fog rolling over the new road cut before the morning buses started."
      },
      {
        tag: "LOCKHART GAP",
        gradient: "linear-gradient(135deg, rgba(181,101,44,0.75), rgba(61,92,72,0.85))",
        caption: "Quick breather to clean visors and let the engines cool down."
      }
    ]
  },


  vagamon: {
    title: "Vagamon Pine Forest",
    tag: "Camping",
    when: "Winter weekend",
    paragraphs: [
      "No phone signal after Kolahalamedu, which was the entire point of going. Four of us, two small tents, and a cheap portable camping stove that took twenty minutes to boil enough water for four cups of black tea.",
      "The last two kilometers were all loose mud and wet pine needles where you basically paddle with your feet. Woke up at 6 AM to cows grazing right outside the tent flap and mist so thick you couldn't see the bikes parked ten feet away."
    ],
    footnote: "Two tents, zero cellular bars, back home by Sunday evening.",
    slides: [
      {
        tag: "PINE VALLEY",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.9), rgba(27,30,39,0.95))",
        caption: "Pitching camp just before the light disappeared behind the hill."
      },
      {
        tag: "THE MORNING MIST",
        gradient: "linear-gradient(135deg, rgba(181,101,44,0.8), rgba(27,30,39,0.9))",
        caption: "Bikes covered in morning condensation before heading out."
      }
    ]
  },

  varkala: {
    title: "Varkala Cliffside",
    tag: "Coast",
    when: "Saturday afternoon run",
    paragraphs: [
      "Just an easy afternoon blast down the coastal highway to catch the sunset from the cliff edge. Parked near the helipad, sat on the red dirt with fresh lime sodas, and watched paragliders floating over the waves until dark.",
      "Rode back late through the narrow coastal backroads under the coconut palms — cool sea air the entire way home."
    ],
    footnote: "Casual 1-day run • Best lemon soda on the cliff",
    slides: [
      {
        tag: "NORTH CLIFF",
        gradient: "linear-gradient(135deg, rgba(217,130,74,0.85), rgba(61,92,72,0.75))",
        caption: "Red laterite cliffs looking out over the evening surf."
      },
      {
        tag: "COAST ROAD",
        gradient: "linear-gradient(135deg, rgba(18,20,26,0.9), rgba(181,101,44,0.75))",
        caption: "Narrow beach road on the way back through Kollam."
      }
    ]
  },

  kovalam: {
    title: "Kovalam & South Cape",
    tag: "Coast",
    when: "Weekend loop",
    paragraphs: [
      "A quick loop down to the southern tip. The stretch past Vizhinjam's new harbour has some wide, empty tarmac where you can just settle into a steady cruising rhythm. Stopped on the rocks near the lighthouse to listen to the waves hit the tetrapods and grab some fresh fried fish from the beach stall.",
      "Salty visor and a sore clutch hand on the ride back into city traffic, but a good Saturday nonetheless."
    ],
    footnote: "Fast highway run south • Salty wind all afternoon",
    slides: [
      {
        tag: "LIGHTHOUSE POINT",
        gradient: "linear-gradient(135deg, rgba(181,101,44,0.85), rgba(27,30,39,0.95))",
        caption: "Rocky headland overlooking the southern bay."
      }
    ]
  },

  dhanushkodi: {
    title: "Dhanushkodi // Land's End",
    tag: "Road trip",
    when: "3-day interstate ride",
    paragraphs: [
      "The longest trip we've done on the bikes so far. Crossing the Pamban road bridge with the wind violently tugging at your jacket and helmet was equal parts terrifying and unforgettable.",
      "The final stretch to Arichal Munai is surreal — just a thin ribbon of fresh asphalt running between two completely different shades of turquoise water. Walking around the 1964 cyclone church ruins half-buried in the white sand gives you actual goosebumps. Chain needed a serious scrub and kerosene wash once we got back from all the salty sand."
    ],
    footnote: "3 days, 900+ km • Pamban crosswinds & endless salt flats",
    slides: [
      {
        tag: "ARICHAL MUNAI",
        gradient: "linear-gradient(135deg, rgba(61,92,72,0.9), rgba(181,101,44,0.8))",
        caption: "End of the road where the Indian Ocean meets the Bay of Bengal."
      },
      {
        tag: "CHURCH RUINS",
        gradient: "linear-gradient(135deg, rgba(18,20,26,0.95), rgba(140,135,120,0.8))",
        caption: "The submerged town frozen in time since the 1964 storm."
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

  mapState.scale = 1.15;
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

function openSpotLog(spotKey) {
  const data = WAYPOINT_DATA[spotKey];
  if (!data) return;
  currentSpotData = data;
  currentSlideIndex = 0;

  const overlay = document.getElementById('spotModalOverlay');
  const titleEl = document.getElementById('modalTitle');
  const tagEl = document.getElementById('modalTag');
  const whenEl = document.getElementById('modalWhen');
  const storyEl = document.getElementById('modalStory');
  const footnoteEl = document.getElementById('modalFootnote');

  titleEl.textContent = data.title;
  tagEl.textContent = data.tag;
  whenEl.textContent = data.when;

  // Build natural paragraphs
  storyEl.innerHTML = data.paragraphs.map(p => `<p class="spot-story-p">${p}</p>`).join('');
  footnoteEl.textContent = data.footnote;

  // Build Carousel Slides
  buildCarouselSlides(data.slides);

  overlay.classList.add('is-open');
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
    track.appendChild(slideDiv);


    if (slides.length > 1) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'is-active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
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
