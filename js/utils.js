/**
 * ============================================================
 * SHRI MEKALSUTA TRADERS — Reusable Utilities
 * ============================================================
 */

'use strict';

/**
 * Display accessible floating toast message
 * @param {string} msg 
 * @param {'success'|'error'|'info'} type 
 */
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.app-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'app-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? '#16A34A' : '#EF4444'};
    color: white; padding: 12px 22px; border-radius: 24px;
    font-weight: 600; font-size: 0.9375rem; z-index: 99999;
    box-shadow: 0 8px 30px rgba(0,0,0,.25); opacity: 0;
    transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Inter', sans-serif; pointer-events: none;
    text-align: center; max-width: 90vw;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * Open WhatsApp conversation with prefilled message
 * @param {string} [msg]
 */
function openWhatsApp(msg) {
  const phone = window.CONFIG?.PHONE_NUMBER || '918109216102';
  const text = msg || window.CONFIG?.DEFAULT_WA_MESSAGE || 'Hello! I am interested in building materials.';
  const url = new URL(`https://wa.me/${encodeURIComponent(phone)}`);
  url.searchParams.set('text', text);
  window.open(url.href, '_blank', 'noopener,noreferrer');
}

/**
 * Initialize IntersectionObserver scroll reveal effects
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/**
 * Initialize animated statistics counters
 */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = Number.isInteger(target)
        ? Math.floor(current) + suffix
        : current.toFixed(1) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/**
 * Initialize infinite brand logo marquee
 */
function initMarquee() {
  const marquee = document.querySelector('.brands-marquee');
  if (!marquee || marquee.dataset.cloned) return;
  marquee.dataset.cloned = 'true';
  const clone = marquee.cloneNode(true);
  marquee.parentNode.appendChild(clone);
}

/**
 * Initialize FAQ and accordion widgets
 */
function initAccordion() {
  document.querySelectorAll('.accordion-item, .faq-item').forEach(item => {
    const header = item.querySelector('.accordion-header, .faq-question');
    header?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      const siblings = item.parentElement?.querySelectorAll('.accordion-item.open, .faq-item.open');
      siblings?.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// Expose on window for global and inline trigger access
window.showToast = showToast;
window.openWhatsApp = openWhatsApp;
window.initScrollReveal = initScrollReveal;
window.initCounters = initCounters;
window.initMarquee = initMarquee;
window.initAccordion = initAccordion;
