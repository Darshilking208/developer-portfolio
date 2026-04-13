/* ═══════════════════════════════════════════════════════════
   script.js  |  Darshil K Prajapati  |  Portfolio
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. PARTICLE CANVAS  — Neural-network style background
   ────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  /* Config */
  const CFG = {
    count:       110,     // number of particles
    maxDist:     145,     // max distance for drawing connections
    speed:       0.55,    // base movement speed
    radius:      { min: 1.2, max: 3.2 },
    mouseRadius: 130,     // repulsion radius around cursor
    pushForce:   0.012,   // how strongly particles flee cursor
    colors: {
      particle: [
        'rgba(0, 212, 255, ',   // cyan
        'rgba(155, 93, 229, ',  // purple
        'rgba(0, 245, 160, ',   // green
      ],
      line: 'rgba(0, 212, 255, ',
    },
  };

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  /* Resize canvas to fill window */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  /* Track mouse globally */
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  /* Build / rebuild particle pool */
  function buildParticles() {
    particles = [];
    const n = Math.min(CFG.count, Math.floor(W * H / 12000)); // fewer on small screens
    for (let i = 0; i < n; i++) {
      const colorStr = CFG.colors.particle[Math.floor(Math.random() * CFG.colors.particle.length)];
      particles.push({
        x:      Math.random() * W,
        y:      Math.random() * H,
        vx:     (Math.random() - 0.5) * CFG.speed,
        vy:     (Math.random() - 0.5) * CFG.speed,
        r:      CFG.radius.min + Math.random() * (CFG.radius.max - CFG.radius.min),
        alpha:  0.3 + Math.random() * 0.5,
        color:  colorStr,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
  }
  buildParticles();

  /* ── Animation Loop ── */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);
    frame++;

    // Move & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      /* Repulsion from mouse */
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.mouseRadius && dist > 0) {
        const force = (1 - dist / CFG.mouseRadius) * CFG.pushForce;
        p.vx += (dx / dist) * force * 2;
        p.vy += (dy / dist) * force * 2;
      }

      /* Dampen velocity so it doesn't explode */
      p.vx *= 0.998;
      p.vy *= 0.998;

      /* Move */
      p.x += p.vx;
      p.y += p.vy;

      /* Soft-wrap at edges */
      if (p.x < -10)  p.x = W + 10;
      if (p.x > W+10) p.x = -10;
      if (p.y < -10)  p.y = H + 10;
      if (p.y > H+10) p.y = -10;

      /* Pulse alpha */
      const pulseAlpha = p.alpha * (0.7 + 0.3 * Math.sin(frame * 0.02 + p.pulseOffset));

      /* Draw dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + pulseAlpha + ')';
      ctx.fill();

      /* Glow ring on bigger particles */
      if (p.r > 2.2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (pulseAlpha * 0.12) + ')';
        ctx.fill();
      }

      /* Draw connections to nearby particles */
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const ed = Math.sqrt(ex * ex + ey * ey);
        if (ed < CFG.maxDist) {
          const lineAlpha = (1 - ed / CFG.maxDist) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = CFG.colors.line + lineAlpha + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }
  animate();
})();


/* ──────────────────────────────────────────────────────────
   2. CURSOR GLOW  — Spotlight that follows the mouse
   ────────────────────────────────────────────────────────── */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');

  // Update glow position directly on each mousemove for silky smoothness
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  // Hide glow when mouse leaves window
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
})();


/* ──────────────────────────────────────────────────────────
   3. NAVBAR — Scroll styling + active link tracking
   ────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navList   = document.getElementById('navLinks');

  /* Scrolled class */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    /* Highlight active section */
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu toggle */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navList.classList.toggle('open');
  });

  /* Close menu on link click */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navList.classList.remove('open');
    });
  });
})();


/* ──────────────────────────────────────────────────────────
   4. SMOOTH SCROLL — Offset for fixed navbar height
   ────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ──────────────────────────────────────────────────────────
   5. TYPEWRITER EFFECT  — Hero tagline
   ────────────────────────────────────────────────────────── */
(function initTypewriter() {
  const el      = document.getElementById('typewriter');
  const phrases = [
    'Creative Developer',
    'Web & Mobile Innovator',
    'Full-Stack Engineer',
    'AI Explorer',
    'Problem Solver',
    'Code Craftsman',
  ];
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pauseTimer = null;

  function type() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        clearTimeout(pauseTimer);
        pauseTimer = setTimeout(type, 1800); // pause before deleting
        return;
      }
      setTimeout(type, 80 + Math.random() * 40);
    } else {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }

  // Start after a short delay so hero animation has settled
  setTimeout(type, 900);
})();


/* ──────────────────────────────────────────────────────────
   6. STAT COUNTER ANIMATION  — Hero numbers count up
   ────────────────────────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const start    = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(eased * target);
    if (t < 1) requestAnimationFrame(step);
    else        el.textContent = target;
  }
  requestAnimationFrame(step);
}


/* ──────────────────────────────────────────────────────────
   7. SKILL BAR BUILDER  — Generates bar markup from data attrs
   ────────────────────────────────────────────────────────── */
function buildSkillBars() {
  document.querySelectorAll('.skill-row').forEach(row => {
    const skill = row.dataset.skill;
    const pct   = row.dataset.pct;

    row.innerHTML = `
      <div class="skill-bar-label">
        <span>${skill}</span>
        <span class="pct-label">${pct}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-width="${pct}" style="width:0%"></div>
      </div>
    `;
  });
}
buildSkillBars();


/* ──────────────────────────────────────────────────────────
   8. INTERSECTION OBSERVER  — Scroll reveal + skill bars
   ────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  /* Reveal observer — handles .reveal-up / .reveal-left / .reveal-right */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObs.observe(el);
  });

  /* Skill bar observer — triggers fill animation once visible */
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
      barObs.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skill-card').forEach(card => barObs.observe(card));

  /* Stat counter observer */
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statObs.observe(heroStats);
})();


/* ──────────────────────────────────────────────────────────
   9. PROJECT CARD  — 3-D tilt on mouse move
   ────────────────────────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
      const dy   = (e.clientY - cy) / (rect.height / 2); // -1 to 1
      this.style.transform = `
        translateY(-6px)
        rotateX(${-dy * 6}deg)
        rotateY(${ dx * 6}deg)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
})();


/* ──────────────────────────────────────────────────────────
  10. CONTACT FORM  — Submit handler
   ────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ff4d6d';
        valid = false;
        // Reset colour after 2 s
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
      }
    });
    if (!valid) return;

    // Simulate sending (replace with real fetch/axios in production)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1400);
  });
})();


/* ──────────────────────────────────────────────────────────
  11. SECTION BG GRADIENT  — Shifts subtle ambient colour
      based on which section is in view (parallax feel)
   ────────────────────────────────────────────────────────── */
(function initAmbientColor() {
  const sectionColors = {
    hero:     '0, 212, 255',    // cyan
    about:    '155, 93, 229',   // purple
    skills:   '0, 245, 160',    // green
    projects: '0, 212, 255',    // cyan
    contact:  '155, 93, 229',   // purple
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id    = entry.target.id;
      const color = sectionColors[id];
      if (!color) return;
      // Update the canvas glow tint very subtly
      document.documentElement.style.setProperty(
        '--section-tint', `rgba(${color}, 0.03)`
      );
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
})();


/* ──────────────────────────────────────────────────────────
  12. PARALLAX — Subtle vertical shift on scrollable elements
   ────────────────────────────────────────────────────────── */
(function initParallax() {
  // Only on non-mobile for performance
  if (window.innerWidth < 768) return;

  function onScroll() {
    const sy = window.scrollY;

    // Hero name drifts slightly upward on scroll
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${sy * 0.18}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ──────────────────────────────────────────────────────────
  13. PAGE LOAD  — Staggered entrance for hero elements
   ────────────────────────────────────────────────────────── */
(function initPageLoad() {
  // Hero elements marked .reveal-up already have CSS transitions;
  // we just need to trigger them once the DOM is ready.
  window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure CSS is loaded
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero-section .reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), 100 + i * 130);
      });
    });
  });
})();


/* ──────────────────────────────────────────────────────────
  14. FOOTER  — Back to top on logo click
   ────────────────────────────────────────────────────────── */
document.querySelectorAll('.footer-logo, .nav-logo').forEach(el => {
  el.style.cursor = 'none';
});


/* ──────────────────────────────────────────────────────────
  15. MOUSE DOT  — Small cyan dot that follows cursor exactly
   ────────────────────────────────────────────────────────── */
(function initMouseDot() {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.85);
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.8), 0 0 16px rgba(0, 212, 255, 0.4);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.08s ease, width 0.2s ease, height 0.2s ease, background 0.2s ease;
  `;
  document.body.appendChild(dot);

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
  });

  // Expand dot when hovering interactive elements
  const interactors = 'a, button, input, textarea, .tech-icon-item, .project-card, .skill-card';
  document.querySelectorAll(interactors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width      = '14px';
      dot.style.height     = '14px';
      dot.style.background = 'rgba(155, 93, 229, 0.9)';
      dot.style.boxShadow  = '0 0 12px rgba(155, 93, 229, 0.8)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width      = '8px';
      dot.style.height     = '8px';
      dot.style.background = 'rgba(0, 212, 255, 0.85)';
      dot.style.boxShadow  = '0 0 8px rgba(0, 212, 255, 0.8)';
    });
  });
})();
