/**
 * ============================================================
 * SHRI MEKALSUTA TRADERS — Application Entry & Orchestrator
 * ============================================================
 */

'use strict';

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('loaded'), 80);
  });
}

// ── Master DOM Ready Initialization ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  if (typeof window.initNavbar === 'function') window.initNavbar();
  if (typeof window.setActiveNavLink === 'function') window.setActiveNavLink();
  if (typeof window.initSmoothScroll === 'function') window.initSmoothScroll();

  // Core UI & Micro-interactions
  initHero();
  if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
  if (typeof window.initCounters === 'function') window.initCounters();
  if (typeof window.initMarquee === 'function') window.initMarquee();
  if (typeof window.initAccordion === 'function') window.initAccordion();

  // Gallery & Forms
  if (typeof window.initLightbox === 'function') window.initLightbox();
  if (typeof window.initProductGallery === 'function') window.initProductGallery();
  if (typeof window.initMobileTabs === 'function') window.initMobileTabs();
  if (typeof window.initFormValidation === 'function') window.initFormValidation();
  if (typeof window.initQuoteFormAutofill === 'function') window.initQuoteFormAutofill();
});
