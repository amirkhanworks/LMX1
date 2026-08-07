// Mobile nav toggle
const navToggle = document.querySelector('.nav__toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Animated stat counters — respects prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll('[data-count-to]');

function animateCounter(el) {
  const target = parseFloat(el.dataset.countTo);
  const suffix = el.dataset.suffix || '';

  if (prefersReducedMotion || !target) {
    el.textContent = target + suffix;
    return;
  }

  const duration = 1200;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => observer.observe(el));
} else {
  counters.forEach(animateCounter);
}

// FAQ tabs (Before You Buy / After You Buy) — only present on about.html, guarded so it's a no-op elsewhere
const faqTabs = document.querySelectorAll('[data-faq-tab]');
if (faqTabs.length) {
  faqTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-faq-tab');

      faqTabs.forEach((t) => t.classList.toggle('is-active', t === tab));

      document.querySelectorAll('[data-faq-panel]').forEach((panel) => {
        panel.hidden = panel.getAttribute('data-faq-panel') !== target;
      });
    });
  });
}
