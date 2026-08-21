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

const FIELD_LIMITS = Object.freeze({
  name: 100,
  fullName: 100,
  email: 254,
  phone: 15,
  message: 2000,
  projectDetails: 2000
});

/**
 * Production Form Validation and Submission Engine
 */
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.setAttribute('method', 'POST');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.dataset.submitting === 'true') return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const fields = form.querySelectorAll('input, textarea, select');
      let isValid = true;

      fields.forEach(field => {
        const value = sanitizeInput(field.value);
        field.value = value;
        const error = field.closest('.form-group')?.querySelector('.form-error');
        let fieldValid = Boolean(value);
        let errorMessage = '';

        if (!field.required && !value) {
          return;
        }
        if (!fieldValid) {
          errorMessage = 'This field is required.';
        } else if (field.type === 'email' && !field.validity.valid) {
          fieldValid = false;
          errorMessage = 'Please enter a valid email address.';
        } else if (field.type === 'tel' || field.name === 'phone') {
          const digits = value.replace(/\D/g, '');
          fieldValid = /^(?:91)?[6-9]\d{9}$/.test(digits);
          if (!fieldValid) errorMessage = 'Please enter a valid 10-digit mobile number.';
        }

        const nativeMaxLength = Number(field.maxLength);
        const maxLength = FIELD_LIMITS[field.name] || (nativeMaxLength > 0 ? nativeMaxLength : 2000);
        if (fieldValid && value.length > maxLength) {
          fieldValid = false;
          errorMessage = `Please keep this field under ${maxLength} characters.`;
        }

        if (!fieldValid) {
          isValid = false;
          field.style.borderColor = '#EF4444';
          field.setAttribute('aria-invalid', 'true');
          if (error) {
            error.textContent = errorMessage;
            error.style.display = 'block';
          }
        } else {
          field.style.borderColor = '';
          field.removeAttribute('aria-invalid');
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
        const cleanValue = sanitizeInput(value);
        payload[key] = payload[key]
          ? `${payload[key]}, ${cleanValue}`
          : cleanValue;
      });

      // Submit button loading & debounce
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';
      form.dataset.submitting = 'true';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
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
        form.dataset.submitting = 'complete';
        setTimeout(() => {
          window.location.href = 'thank-you.html';
        }, 500);

      } catch (err) {
        console.error('Form submission failed:', err);
        if (typeof window.showToast === 'function') {
          window.showToast('We could not send your request. Please try again or use WhatsApp.', 'error');
        }
      } finally {
        if (form.dataset.submitting !== 'complete') form.dataset.submitting = 'false';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = '';
        }
      }
    });

    // Real-time validation clearance
    form.querySelectorAll('input, textarea, select').forEach(field => {
      ['input', 'change'].forEach(eventName => {
        field.addEventListener(eventName, () => {
          if (field.value.trim()) {
            field.style.borderColor = '';
            field.removeAttribute('aria-invalid');
            const error = field.closest('.form-group')?.querySelector('.form-error');
            if (error) error.style.display = 'none';
          }
        });
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
