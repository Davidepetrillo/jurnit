/* ============================================================
   JURNIT — minimal interactions
   ============================================================ */
(function () {
  'use strict';

  const progress = document.getElementById('progress');
  const nav = document.getElementById('nav');

  /* ---------- scroll: progress bar + sticky nav ---------- */
  function onScroll() {
    const h = document.documentElement;
    const frac = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (progress) progress.style.width = (frac * 100) + '%';
    if (nav) nav.classList.toggle('is-stuck', h.scrollTop > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- scenes: guard against a missing image file ---------- */
  document.querySelectorAll('.scene img').forEach(img => {
    const fail = () => img.closest('.scene').classList.add('is-missing');
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('is-in'), e.target.getAttribute('data-d') || 0);
        io.unobserve(e.target);
      }
    }), { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------- animated counter ---------- */
  const counter = document.getElementById('counter');
  if (counter) {
    const target = +counter.getAttribute('data-target');
    new IntersectionObserver((es, obs) => {
      if (!es[0].isIntersecting) return;
      const t0 = performance.now(), dur = 1500;
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        counter.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      obs.disconnect();
    }, { threshold: .6 }).observe(counter);
  }

  /* ---------- waitlist forms ---------- */
  const toast = document.getElementById('toast');
  let tt;
  function showToast(m) {
    if (!toast) return;
    toast.textContent = m; toast.classList.add('is-show');
    clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-show'), 3200);
  }
  const valid = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  function wire(form) {
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type=email]'), v = input.value.trim();
      if (!valid(v)) {
        form.classList.add('is-err'); setTimeout(() => form.classList.remove('is-err'), 500);
        input.focus(); showToast('Please enter a valid email'); return;
      }
      try {
        const l = JSON.parse(localStorage.getItem('jurnit_waitlist') || '[]');
        if (!l.includes(v)) l.push(v);
        localStorage.setItem('jurnit_waitlist', JSON.stringify(l));
      } catch (_) {}
      input.value = ''; input.blur();
      showToast("You're on the list — welcome to Jurnit ✦");
      if (counter) counter.textContent = (parseInt(counter.textContent.replace(/\D/g, ''), 10) + 1).toLocaleString();
    });
  }
  wire(document.getElementById('heroForm'));
  wire(document.getElementById('ctaForm'));
})();
