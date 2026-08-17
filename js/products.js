/**
 * ============================================================
 * SHRI MEKALSUTA TRADERS — Products & Catalog Filtering Module
 * ============================================================
 */

'use strict';

/**
 * Filter product catalog by category
 * @param {string} category 
 * @param {HTMLElement} [btnElement] 
 */
function filterProducts(category, btnElement) {
  const cards = document.querySelectorAll('[data-category]');
  const btns = document.querySelectorAll('.filter-btn, [data-filter-btn]');
  const cat = (category || 'all').toLowerCase();

  btns.forEach(btn => {
    if (btnElement && btn === btnElement) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else if (!btnElement) {
      const match = (btn.dataset.filterBtn || btn.textContent || '').trim().toLowerCase() === cat;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', String(match));
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  cards.forEach(card => {
    const cardCat = (card.dataset.category || '').toLowerCase();
    const show = cat === 'all' || cardCat.includes(cat) || cat.includes(cardCat);
    card.style.display = show ? '' : 'none';
    if (show) {
      card.style.animation = 'fadeUp 0.35s ease forwards';
    }
  });
}

/**
 * Live search filter across catalog cards
 * @param {string} query 
 */
function searchProducts(query) {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('[data-product-name]').forEach(card => {
    const name = (card.dataset.productName || '').toLowerCase();
    const show = !q || name.includes(q);
    card.style.display = show ? '' : 'none';
  });
}

window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
