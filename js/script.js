// ============ Nav toggle (mobile) ============
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ Scroll reveal ============
// Individual elements that fade/slide in as they enter view
const revealTargets = document.querySelectorAll(
  '.product-card, .philosophy-card, .testimonial-card, .trust-item, .section-head, .pull-quote'
);
revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--stagger', i % 9); // resets naturally per grid group
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => io.observe(el));

// Whole sections fade/slide in together as the user scrolls to them,
// giving a smooth transition from one section to the next
const sectionTargets = document.querySelectorAll('.section-fade');
const sectionIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      sectionIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

sectionTargets.forEach(el => sectionIO.observe(el));

// ============ Hero canvas: drifting roe ============
(function () {
  const canvas = document.getElementById('roeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const COUNT = prefersReduced ? 0 : Math.min(140, Math.floor((w * h) / 9000));
  const beads = [];
  for (let i = 0; i < COUNT; i++) {
    beads.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.4 + Math.random() * 2.4,
      speed: 0.08 + Math.random() * 0.18,
      drift: (Math.random() - 0.5) * 0.06,
      hueMix: Math.random(),
      alpha: 0.18 + Math.random() * 0.35
    });
  }

  function colorFor(mix, alpha) {
    // interpolate between deep bronze and gold highlight
    const r = Math.round(120 + mix * 90);
    const g = Math.round(90 + mix * 80);
    const b = Math.round(40 + mix * 40);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const b of beads) {
      ctx.beginPath();
      ctx.fillStyle = colorFor(b.hueMix, b.alpha);
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReduced) {
        b.y -= b.speed;
        b.x += b.drift;
        if (b.y < -10) { b.y = h + 10; b.x = Math.random() * w; }
        if (b.x < -10) b.x = w + 10;
        if (b.x > w + 10) b.x = -10;
      }
    }
    if (!prefersReduced) requestAnimationFrame(draw);
  }
  draw();
})();

// ============ Contact form (static-site friendly) ============
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const variety = data.get('variety');
    const subject = encodeURIComponent(`Consulta — ${variety}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nCorreo: ${data.get('email')}\nVariedad: ${variety}\nMensaje: ${data.get('message')}`
    );
    window.location.href = `mailto:reservas@caviarreserve.com?subject=${subject}&body=${body}`;
    formNote.textContent = 'Abriendo su cliente de correo…';
  });
}

// ============ Header background on scroll ============
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    if (window.scrollY > 40) header.style.background = 'rgba(10,14,24,0.96)';
    else header.style.background = '';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ============ 3D interactive logo (tilts toward the cursor, gold shine sweep) ============
(function () {
  const wrap = document.getElementById('heroLogo3d');
  const stage = document.getElementById('logo3dStage');
  const shine = document.getElementById('logo3dShine');
  if (!wrap || !stage) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (prefersReduced || isTouch) return; // keep it static/simple on touch & reduced-motion

  const MAX_TILT = 20; // degrees
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let raf = null;

  function onMove(e) {
    const rect = wrap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;  // 0..1
    const py = (e.clientY - rect.top) / rect.height;   // 0..1
    const nx = Math.min(Math.max(px, 0), 1) * 2 - 1;    // -1..1
    const ny = Math.min(Math.max(py, 0), 1) * 2 - 1;    // -1..1

    targetY = nx * MAX_TILT;        // left/right cursor -> rotateY
    targetX = -ny * MAX_TILT;       // up/down cursor -> rotateX (inverted for natural feel)

    // move the gold shine sweep across the logo silhouette based on cursor position
    const shinePos = 50 + nx * 40;
    if (shine) shine.style.backgroundPosition = `${shinePos}% 50%`;

    if (!raf) raf = requestAnimationFrame(animate);
  }

  function animate() {
    // smooth easing toward the target angle for a fluid, elegant motion
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    stage.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;

    if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
      raf = requestAnimationFrame(animate);
    } else {
      raf = null;
    }
  }

  function onLeave() {
    targetX = 0; targetY = 0;
    if (shine) shine.style.backgroundPosition = '50% 50%';
    if (!raf) raf = requestAnimationFrame(animate);
  }

  wrap.addEventListener('mousemove', onMove);
  wrap.addEventListener('mouseleave', onLeave);
})();
