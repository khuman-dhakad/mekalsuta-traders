/**
 * ============================================================
 * SHRI MEKALSUTA TRADERS — Gallery & Lightbox Module
 * ============================================================
 */

'use strict';

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const imgEl = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  let lastActiveElement = null;

  const openLightbox = (src, alt = 'Enlarged view') => {
    lastActiveElement = document.activeElement;
    if (imgEl) {
      imgEl.src = src;
      imgEl.alt = alt;
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (imgEl) imgEl.src = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => openLightbox(el.dataset.lightbox, el.dataset.alt || ''));
    el.style.cursor = 'pointer';
  });

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        closeBtn?.focus();
      }
    }
  });
}

function initProductGallery() {
  const mainImg = document.querySelector('.product-gallery-main img');
  const thumbs = document.querySelectorAll('.product-gallery-thumb');

  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.querySelector('img')?.src;
      if (src) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = src;
          mainImg.style.opacity = '1';
        }, 150);
      }
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  if (mainImg) {
    mainImg.style.transition = 'opacity 0.15s ease';
  }
}

function initMobileTabs() {
  document.querySelectorAll('.tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const panelContainer = document.querySelector('[data-tab-panels="' + tabs.dataset.tabGroup + '"]');
        if (panelContainer) {
          panelContainer.querySelectorAll('[data-panel]').forEach(p => {
            p.style.display = p.dataset.panel === tabName ? '' : 'none';
          });
        }
      });
    });
  });
}

window.initLightbox = initLightbox;
window.initProductGallery = initProductGallery;
window.initMobileTabs = initMobileTabs;
