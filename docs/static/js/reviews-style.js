const reviews = [
  { i:"B", name:"Bea S.",    color:"linear-gradient(135deg,#f9a8d4,#e8607a)", stars:5, text:"KRES Co. is my absolute favorite flower shop! Every bouquet I've ordered has been nothing short of breathtaking. The roses are always fresh, the wrapping is elegant, and the customer service is so warm and personal. I always recommend them to my friends!", top:true },
  { i:"A", name:"Angela R.", color:"linear-gradient(135deg,#fca5a5,#ef4444)", stars:5, text:"The bouquet was absolutely stunning! I ordered the red rose arrangement for my mom's birthday and she literally cried happy tears. Worth every peso — will definitely order again!" },
  { i:"M", name:"Maria C.",  color:"linear-gradient(135deg,#c4b5fd,#a78bfa)", stars:5, text:"Ordered last minute and they still delivered on time with the most gorgeous pastel bouquet. Packaging was perfect — it arrived fresh and beautiful. My sister was so surprised!" },
  { i:"L", name:"Lara G.",   color:"linear-gradient(135deg,#d8b4fe,#9333ea)", stars:5, text:"Ordered the lilac bouquet for our monthsary and my partner was so happy. Flowers were super fresh and lasted more than a week! The packaging is also very aesthetic and Instagrammable." },
  { i:"P", name:"Paolo A.",  color:"linear-gradient(135deg,#fcd34d,#f59e0b)", stars:5, text:"Got the premium bouquet as a surprise and it was absolutely gorgeous. Great quality and super fast delivery. She literally posted it on her Instagram right away — everyone was asking where it's from!" },
  { i:"J", name:"Jessa L.",  color:"linear-gradient(135deg,#86efac,#34d399)", stars:4, text:"KRES never disappoints! I've ordered multiple times for anniversaries and each time the flowers are fresh and the presentation is always on point. Highly recommend to everyone!" },
  { i:"D", name:"Diana T.",  color:"linear-gradient(135deg,#fbcfe8,#ec4899)", stars:5, text:"Ordered for Mother's Day — the lilies were pristine and absolutely fragrant. Mom kept the bouquet on display for weeks. Truly a premium experience at a very fair price!" },
  { i:"K", name:"Kyle M.",   color:"linear-gradient(135deg,#9ca3af,#374151)", stars:5, text:"Got the black & white bouquet as a surprise for my girlfriend and she was speechless. Super elegant and unique design. Will definitely order again for our anniversary!" },
  { i:"R", name:"Renz B.",   color:"linear-gradient(135deg,#fde68a,#f59e0b)", stars:5, text:"The sunflower & baby's breath combo was perfect for our office event. Everyone loved it! Great quality, reasonable price, and really thoughtful packaging." },
  { i:"S", name:"Sofia V.",  color:"linear-gradient(135deg,#fda4af,#e11d48)", stars:5, text:"I've been ordering from KRES for every special occasion for two years and they have never let me down. The blooms are always fresh, the wrapping is gorgeous, and delivery is always on time!" }
];

const track   = document.getElementById('track');
const dotsEl  = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const total   = reviews.length;

let current = 1;

function starsHTML(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
function wrap(i)       { return ((i % total) + total) % total; }

function build() {
  track.innerHTML = '';

  [-2, -1, 0, 1, 2].forEach(offset => {
    const idx = wrap(current + offset);
    const r   = reviews[idx];

    const cls = offset === 0 ? 'active'
              : Math.abs(offset) === 1 ? 'adjacent'
              : 'side';

    const card = document.createElement('div');
    card.className = 'review-card ' + cls;

    card.innerHTML =
      (r.top && cls === 'active' ? '<div class="featured-badge">✨ Top Review</div>' : '') +
      '<div class="reviewer-row">' +
        '<div class="avatar" style="background:' + r.color + '">' + r.i + '</div>' +
        '<div class="reviewer-name">' + r.name + '</div>' +
      '</div>' +
      '<span class="quote-mark">\u201c</span>' +
      '<p class="review-text">' + r.text + '</p>' +
      '<div class="stars">' + starsHTML(r.stars) + '</div>';

    if (cls === 'adjacent') {
      card.addEventListener('click', () => goTo(idx));
    }

    track.appendChild(card);
  });

  dotsEl.innerHTML = '';
  for (let di = 0; di < total; di++) {
    const d = document.createElement('span');
    d.className = 'dot' + (di === current ? ' active' : '');
    d.addEventListener('click', () => goTo(di));
    dotsEl.appendChild(d);
  }

  requestAnimationFrame(() => {
    const wrapEl   = document.querySelector('.carousel-track-wrap');
    const wrapW    = wrapEl.offsetWidth;
    const activeEl = track.querySelector('.review-card.active');
    if (!activeEl) return;
    const offset = activeEl.offsetLeft - (wrapW / 2) + (activeEl.offsetWidth / 2);
    track.style.transition = 'none';
    track.style.transform  = 'translateX(' + (-Math.max(0, offset)) + 'px)';
    requestAnimationFrame(() => {
      track.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
    });
  });
}

function goTo(raw) {
  current = wrap(raw);
  build();
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  goTo(current - 1);
  if (e.key === 'ArrowRight') goTo(current + 1);
});

let auto = setInterval(() => goTo(current + 1), 4500);
const outer = document.querySelector('.carousel-outer');
outer.addEventListener('mouseenter', () => clearInterval(auto));
outer.addEventListener('mouseleave', () => {
  auto = setInterval(() => goTo(current + 1), 4500);
});

/* --- SWIPE FUNCTIONALITY WITH 0.5s DELAY --- */
let touchStartX = 0;
let touchEndX = 0;
let lastSwipeTime = 0;
const SWIPE_DELAY = 500;

const trackWrap = document.querySelector('.carousel-track-wrap');
if (trackWrap) {
  trackWrap.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  trackWrap.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
}

function handleSwipe() {
  const now = Date.now();
  if (now - lastSwipeTime < SWIPE_DELAY) return;
  lastSwipeTime = now;

  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      goTo(current + 1);
    } else {
      goTo(current - 1);
    }
  }
}

window.addEventListener('resize', build);
build();
```

---

**File structure:**
```
reviews-style.js
reviews-style.css
reviews.html