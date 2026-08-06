/* ============================================================
   SHRI MEKALSUTA TRADERS — Main JavaScript
   ============================================================ */

'use strict';

// ── DOM Ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHero();
  initScrollReveal();
  initCounters();
  initMarquee();
  initLightbox();
  initAccordion();
  initMobileTabs();
  initFormValidation();
  initProductGallery();
  setActiveNavLink();
});

// ── Navbar ────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const annoBar = document.querySelector('.announcement-bar');

  if (!navbar) return;

  // Sticky scroll effect
  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on overlay click
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !navbar.contains(e.target) && !mobileNav.contains(e.target)) {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('open');
      mobileNav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Hero Loading Animation ─────────────────────────────────
function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('loaded'), 100);
  });
}

// ── Scroll Reveal ─────────────────────────────────────────
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

// ── Animated Counters ──────────────────────────────────────
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
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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

// ── Brand Marquee ──────────────────────────────────────────
function initMarquee() {
  const marquee = document.querySelector('.brands-marquee');
  if (!marquee) return;
  // Duplicate content for seamless loop
  const clone = marquee.cloneNode(true);
  marquee.parentNode.appendChild(clone);
}

// ── Lightbox ───────────────────────────────────────────────
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const imgEl = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src, alt = '') => {
    imgEl.src = src;
    imgEl.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    imgEl.src = '';
  };

  // Attach to gallery items
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => openLightbox(el.dataset.lightbox, el.dataset.alt || ''));
    el.style.cursor = 'pointer';
  });

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

// ── Accordion ─────────────────────────────────────────────
function initAccordion() {
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    header?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked if was closed
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── Mobile Tabs ────────────────────────────────────────────
function initMobileTabs() {
  document.querySelectorAll('.tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide panels
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

// ── Form Validation ────────────────────────────────────────
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        const error = field.closest('.form-group')?.querySelector('.form-error');
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#EF4444';
          if (error) error.style.display = 'block';
        } else {
          field.style.borderColor = '';
          if (error) error.style.display = 'none';
        }
      });

      if (valid) {
        window.location.href = 'thank-you.html';
      }
    });

    // Real-time validation
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          field.style.borderColor = '';
        }
      });
    });
  });
}

// ── Product Gallery (Detail Page) ─────────────────────────
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

// ── Active Nav Link ────────────────────────────────────────
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Smooth Scroll for Anchor Links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── WhatsApp Helper ────────────────────────────────────────
window.openWhatsApp = (msg = 'Hello, I need a quote for building materials from Shri Mekalsuta Traders.') => {
  const phone = '919425000000'; // placeholder — update with real number
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
};

// ── Category Filter (Products Page) ───────────────────────
window.filterProducts = (category) => {
  const cards = document.querySelectorAll('[data-category]');
  const btns = document.querySelectorAll('[data-filter-btn]');

  btns.forEach(btn => btn.classList.toggle('active', btn.dataset.filterBtn === category));

  cards.forEach(card => {
    const show = category === 'all' || card.dataset.category === category;
    card.style.display = show ? '' : 'none';
    card.style.animation = show ? 'fadeUp 0.4s ease forwards' : 'none';
  });
};

// ── Search Filter ──────────────────────────────────────────
window.searchProducts = (query) => {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('[data-product-name]').forEach(card => {
    const name = card.dataset.productName.toLowerCase();
    card.style.display = name.includes(q) || !q ? '' : 'none';
  });
};

// ── Toast Notification ─────────────────────────────────────
window.showToast = (msg, type = 'success') => {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? '#16A34A' : '#EF4444'};
    color: white; padding: 12px 24px; border-radius: 12px;
    font-weight: 600; font-size: 0.9375rem; z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,.2); opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Inter', sans-serif;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ── Parallax Hero ──────────────────────────────────────────
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg img');
  if (!heroBg) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── WhatsApp Helper ───────────────────────────────────────
window.openWhatsApp = (msg) => {
  const phone = '918109216102'; // Replace with actual phone
  const text = msg || 'Hello! I am interested in your construction materials. Please share pricing.';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
};

// ── FAQ Accordion ─────────────────────────────────────────
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// ── Active nav link ────────────────────────────────────────
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links .nav-link, .nav-mobile .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(page)) {
      link.classList.add('active');
    } else if (page === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });
}

// ── Google Maps — Smart Directions ────────────────────────
//
// Destination: Shri Mekalsuta Traders, Bareli, Madhya Pradesh
// Opens Google Maps with the shop pre-selected as destination.
// If geolocation is available and permitted, passes the user's
// current coordinates as the origin so Maps can show the route
// immediately. Falls back to destination-only link on denial.
//
window.openMaps = () => {
  // Exact destination — business name + coordinates as fallback
  const DEST_NAME   = 'Shri Mekalsuta Traders, Bareli, Madhya Pradesh';
  const DEST_COORDS = '22.9168,79.7311'; // lat,lng of Bareli, MP

  // Google Maps Directions API URL with destination pre-filled
  const mapsBase = 'https://www.google.com/maps/dir/?api=1';
  const destParam = encodeURIComponent(DEST_NAME);

  if (!navigator.geolocation) {
    // Browser doesn't support geolocation — open with destination only
    window.open(
      `${mapsBase}&destination=${destParam}`,
      '_blank', 'noopener'
    );
    return;
  }

  // Try to get current location (timeout: 6 s)
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      // Open with both origin (current location) and destination
      // Maps will immediately render the route
      window.open(
        `${mapsBase}&origin=${latitude},${longitude}&destination=${destParam}`,
        '_blank', 'noopener'
      );
    },
    () => {
      // Permission denied or unavailable — destination-only link
      // User still lands on Maps with the shop already selected
      window.open(
        `${mapsBase}&destination=${destParam}`,
        '_blank', 'noopener'
      );
    },
    { timeout: 6000, maximumAge: 60000 }
  );
};
