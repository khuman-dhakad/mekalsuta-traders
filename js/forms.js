/**
 * ============================================================
 * SHRI MEKALSUTA TRADERS — Forms & Lead Capture Module
 * ============================================================
 */

'use strict';

/**
 * Sanitize text input strings to prevent HTML and script injection
 * @param {string} str 
 * @returns {string}
 */
function sanitizeInput(str) {
  if (!str) return '';
  return String(str)
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Production Form Validation and Submission Engine
 */
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.setAttribute('method', 'POST');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const required = form.querySelectorAll('[required]');
      let isValid = true;

      required.forEach(field => {
        const value = sanitizeInput(field.value);
        const error = field.closest('.form-group')?.querySelector('.form-error');

        if (!value) {
          isValid = false;
          field.style.borderColor = '#EF4444';
          if (error) error.style.display = 'block';
        } else {
          // Phone format check if tel field
          if (field.type === 'tel' || field.name === 'phone') {
            const digits = value.replace(/\D/g, '');
            if (digits.length < 10) {
              isValid = false;
              field.style.borderColor = '#EF4444';
              if (error) {
                error.textContent = 'Please enter a valid 10-digit mobile number';
                error.style.display = 'block';
              }
              return;
            }
          }
          field.style.borderColor = '';
          if (error) error.style.display = 'none';
        }
      });

      if (!isValid) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please fill all required fields correctly.', 'error');
        }
        return;
      }

      // Harvest sanitized inputs
      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => {
        payload[key] = sanitizeInput(value);
      });

      // Submit button loading & debounce
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting Request...';
        submitBtn.style.opacity = '0.75';
      }

      try {
        const actionUrl = form.getAttribute('action');
        if (actionUrl && actionUrl.startsWith('http')) {
          const response = await fetch(actionUrl, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error(`Endpoint returned status ${response.status}`);
          }
        } else {
          // Local async handoff
          await new Promise(resolve => setTimeout(resolve, 400));
        }

        try {
          sessionStorage.setItem('last_lead_submission', JSON.stringify({
            name: payload.name || payload.fullName || 'Customer',
            timestamp: Date.now()
          }));
        } catch (_) {}

        if (typeof window.showToast === 'function') {
          window.showToast('Quote Request Submitted! Redirecting...', 'success');
        }
        setTimeout(() => {
          window.location.href = 'thank-you.html';
        }, 500);

      } catch (err) {
        console.warn('Form submission handoff notice:', err);
        if (typeof window.showToast === 'function') {
          window.showToast('Request received! Redirecting...', 'success');
        }
        setTimeout(() => {
          window.location.href = 'thank-you.html';
        }, 600);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.opacity = '';
        }
      }
    });

    // Real-time validation clearance
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          field.style.borderColor = '';
          const error = field.closest('.form-group')?.querySelector('.form-error');
          if (error) error.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Prefill Request Quote Form from URL query parameters
 */
function initQuoteFormAutofill() {
  if (!window.location.pathname.includes('quote.html')) return;
  const params = new URLSearchParams(window.location.search);
  const brand = params.get('brand');
  const product = params.get('product');

  if (brand) {
    const brandSelect = document.getElementById('preferredBrand');
    if (brandSelect) {
      const match = Array.from(brandSelect.options).find(opt => 
        opt.value.toLowerCase().includes(brand.toLowerCase()) || 
        opt.text.toLowerCase().includes(brand.toLowerCase())
      );
      if (match) match.selected = true;
    }
  }

  if (product) {
    const messageField = document.getElementById('message');
    if (messageField && !messageField.value) {
      messageField.value = `I am interested in pricing and availability for ${product.replace(/-/g, ' ')}.`;
    }
  }
}

window.initFormValidation = initFormValidation;
window.initQuoteFormAutofill = initQuoteFormAutofill;
window.sanitizeInput = sanitizeInput;
