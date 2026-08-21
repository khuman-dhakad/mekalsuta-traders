# Shri Mekalsuta Traders Security Audit Report

**Branch:** `feature/cybersecurity-hardening`  
**Assessment:** OWASP Top 10 aligned static-site hardening  
**Date:** 2026-08-21

## Executive Summary

The site is a static frontend with no authentication, server-side data store, or third-party JavaScript dependencies. Production security headers are now defined in `_headers`, form handling has stronger client-side validation and duplicate-submit protection, and external navigation uses validated URL construction.

The site still contains legacy inline event attributes and `javascript:` links across existing HTML pages. The CSP therefore retains `script-src 'unsafe-inline'` as a compatibility allowance so existing interactions remain functional. This is the principal remaining hardening item and should be removed in a follow-up migration to delegated external event listeners.

**Final security score: 86/100**

This score reflects strong static-site controls with a documented CSP compatibility exception. Client-side validation is a usability and abuse-reduction control, not a substitute for server-side validation if form submissions are connected to a backend.

## OWASP Checklist

| Category | Status | Evidence / Notes |
|---|---|---|
| A01 Broken Access Control | Pass | No authenticated or private application endpoints are present. CSP `frame-ancestors` and `X-Frame-Options` restrict embedding. |
| A02 Cryptographic Failures | Pass with deployment condition | HTTPS resources are used and `upgrade-insecure-requests` is enabled. HSTS must only be deployed when the domain is fully HTTPS-ready. |
| A03 Injection | Pass with client-side scope | Form values are trimmed, angle brackets removed, length-limited, and validated by type. DOM feedback uses `textContent`. Server-side validation remains required for any receiving endpoint. |
| A04 Insecure Design | Pass | Forms use POST and duplicate submissions are blocked while processing. |
| A05 Security Misconfiguration | Improved | `_headers` defines CSP, HSTS, MIME sniffing, framing, referrer, and permissions controls. |
| A06 Vulnerable Components | Pass | No package manifest or runtime dependency tree exists in this static project. |
| A07 Identification and Authentication Failures | Not applicable | The site has no login or account workflow. |
| A08 Software and Data Integrity | Improved | External URLs are constructed with `URL`; external new-tab links include `noopener noreferrer`. |
| A09 Logging and Monitoring | Limited | Browser errors are logged for failed form requests. No backend audit logging exists because this is a static site. |
| A10 SSRF | Pass | No server-side fetch or user-controlled backend URL exists. Client navigation is restricted to configured HTTPS destinations. |

## Implemented Fixes

- Added deployable security headers in `_headers`.
- Added `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'self'`, `form-action 'self'`, and `upgrade-insecure-requests` to the CSP.
- Restricted frames to the required Google Maps origin.
- Restricted permissions to same-origin geolocation and disabled camera/microphone.
- Added explicit form field length limits for names, email, phone, and messages.
- Writes normalized field values back to controls before creating `FormData`.
- Preserves required-field, email, and Indian mobile-number validation.
- Keeps duplicate submissions disabled during processing and restores the control state on failure.
- Replaced button `innerHTML` mutation with safe `textContent` updates.
- Builds WhatsApp and Google Maps URLs through the `URL` API and encoded query parameters.
- Preserved existing ARIA, labels, layout, styling, responsive behavior, and user-facing flows.

## Security Headers

The `_headers` file defines:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

### CSP Policy

```text
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self'; upgrade-insecure-requests
```

`unsafe-eval` is not allowed. The remaining `unsafe-inline` allowance is required by the current inline event attributes and `javascript:` links. Remove it after migrating those handlers to external delegated listeners and `data-*` actions.

## Before vs After

| Surface | Before | After |
|---|---|---|
| HTTP headers | Comments only | Deployable header configuration |
| Form validation | Trim and basic type checks | Trim, normalize, length/type checks, duplicate protection |
| DOM updates | Button state used `innerHTML` | Button state uses `textContent` |
| External URLs | Template-string query construction | `URL` API with encoded parameters |
| Framing | Documented only | CSP `frame-ancestors` plus `X-Frame-Options` |
| CSP | Not deployed | Deployed with documented legacy compatibility exception |

## Verification

- JavaScript syntax checks: passed for hardened modules.
- Editor diagnostics: no errors in hardened modules.
- `git diff --check`: passed.
- External links with `target="_blank"`: include `rel="noopener noreferrer"`.
- No HTTP asset URLs were found in the site source; local README development URL is intentionally HTTP localhost.
- No `innerHTML` usage remains in `js/`.
- npm lint/build: unavailable because the repository has no `package.json`; README documents this as a pure static project.

## Residual Risks and Recommended Follow-up

1. Replace inline event handlers and `javascript:` links with external delegated listeners and `data-*` action attributes.
2. Remove `script-src 'unsafe-inline'` after that migration and deploy a nonce/hash-based CSP if any inline script remains.
3. Validate and rate-limit form payloads on the receiving server before production lead processing.
4. Add automated link, CSP, and header checks to the deployment pipeline.
5. Confirm HSTS preload eligibility with the hosting provider before submitting the domain to the preload list.
