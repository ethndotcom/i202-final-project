// ===============================================================
// site.js — nav, scroll progress, scroll-reveal, counters, flower
// ===============================================================

(function () {
  // ---------- mobile nav ----------
  const nav = document.querySelector('.nav');
  if (nav) {
    const toggle = nav.querySelector('.nav-toggle');
    if (toggle) toggle.addEventListener('click', () => nav.classList.toggle('open'));

    const here = document.body.dataset.section;
    if (here) {
      nav.querySelectorAll('.nav-list a').forEach((a) => {
        if (a.dataset.section === here) a.classList.add('active');
      });
    }
  }

  // ---------- scroll progress ----------
  const bar = document.querySelector('.progress .bar');
  if (bar) {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0;
      bar.style.width = p + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  // ---------- scroll reveal ----------
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('.fade-in').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('in'));
  }

  // ---------- count-up for figures ----------
  // any element with data-count="N" will animate from 0 to N when visible
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const v = Math.round(ease(t) * target);
        el.firstChild.nodeValue = String(v);
        if (t < 1) requestAnimationFrame(tick);
        else el.firstChild.nodeValue = String(target);
      };
      if (el.firstChild && el.firstChild.nodeType === 3) {
        el.firstChild.nodeValue = '0';
        requestAnimationFrame(tick);
      }
    };

    if (!reduce && 'IntersectionObserver' in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              animate(e.target);
              cio.unobserve(e.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      countEls.forEach((el) => cio.observe(el));
    }
  }

  // ---------- interactive flower (chapter 3) ----------
  const flower = document.querySelector('[data-flower]');
  const detail = document.querySelector('[data-flower-detail]');
  if (flower && detail) {
    const petals = flower.querySelectorAll('.flower-petal');
    const labelEl = detail.querySelector('.label');
    const bodyEl = detail.querySelector('.body');

    const setActive = (petal) => {
      petals.forEach((p) => p.classList.remove('active'));
      petal.classList.add('active');
      labelEl.textContent = petal.dataset.label || '';
      bodyEl.textContent = petal.dataset.detail || '';
      detail.classList.add('has-active');
    };

    petals.forEach((p) => {
      p.addEventListener('mouseenter', () => setActive(p));
      p.addEventListener('focus', () => setActive(p));
      p.addEventListener('click', () => setActive(p));
      p.setAttribute('tabindex', '0');
    });

    if (petals.length) setActive(petals[0]);
  }
})();
