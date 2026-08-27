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
  const cards = document.querySelectorAll('[data-product-name]');
  let visibleCount = 0;

  cards.forEach(card => {
    const name = (card.dataset.productName || card.textContent || '').toLowerCase();
    const show = !q || name.includes(q);
    card.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  // Graceful Empty Search State Engine
  let emptyState = document.getElementById('noProductsState');
  const grid = document.getElementById('productGrid') || document.querySelector('.products-grid') || (cards[0] ? cards[0].parentElement : null);

  if (visibleCount === 0 && q) {
    if (!emptyState && grid) {
      emptyState = document.createElement('div');
      emptyState.id = 'noProductsState';
      emptyState.className = 'no-products-state text-center reveal visible mt-8 mb-8 p-8';
      emptyState.style.cssText = 'grid-column: 1 / -1; padding: 48px 24px; background: var(--white); border-radius: var(--radius-xl); border: 1.5px dashed var(--border);';
      emptyState.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
        <h3 class="text-h3 text-primary mb-2">No matching materials found</h3>
        <p class="text-body text-muted mb-6" style="max-width: 480px; margin-left: auto; margin-right: auto;">
          We stock custom steel sections, cement grades, and direct Raipur plant orders. Contact our store team directly!
        </p>
        <div class="flex items-center justify-center gap-3" style="flex-wrap: wrap;">
          <a href="quote.html" class="btn btn-primary">Request Custom Quote</a>
          <a href="tel:+918109216102" class="btn btn-secondary">📞 Call Store: +91 81092 16102</a>
        </div>
      `;
      grid.appendChild(emptyState);
    } else if (emptyState) {
      emptyState.style.display = 'block';
    }
  } else if (emptyState) {
    emptyState.style.display = 'none';
  }
}

window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
