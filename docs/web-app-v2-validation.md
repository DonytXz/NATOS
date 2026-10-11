# Web app v2: implementation and validation

Validated on 2026-10-10 (America/Mexico_City), on branch `codex/web-app-v2`, against baseline `890ec18853af7df54d89d48954fb1127cab29ec5`.

## Delivered

- Rebuilt the Spanish storefront, catalog, cart, authentication, and company/contact pages around a shared visual system with local styles and imagery.
- Separated public navigation from the staff workspace; lazy-loaded feature routes, retained legacy redirects, added page titles and a not-found page.
- Replaced per-item email prompts with one explicit order review. Current validated quantities produce the existing API payload. Per-line outcomes distinguish success, rejection, and uncertain receipt; interrupted requests are not automatically retried.
- Persisted non-sensitive cart selections and outcomes. Other tabs receive updates, request results preserve concurrent additions, and Web Locks suppress simultaneous sends in supported browsers. Storage failures retain the current tab's in-memory cart and show a warning. Invalid quantity errors stop blocking when the corresponding line changes or disappears in another tab.
- Centralized existing session state, safe return destinations, logout, cross-tab session updates, malformed response handling, and API-origin 401 handling. No new authentication header or server capability was assumed.
- Rebuilt all seven staff record areas with independent edit drafts, validation, pending/error states, loaded-record search, pagination, named delete confirmation, and recovery after uncertain mutations. Updates preserve server metadata and untouched value types.
- Added a separate orders view and corrected asynchronous rendering beneath OnPush route components.
- Removed legacy UI CDN scripts, unused pagination/alert dependencies, placeholder content, and decorative GIF usage. Optimized product images and excluded GIF/PSD files from build assets.
- Added a lockfile, pinned Node version, Playwright regression suite, production preview/deep-link fallback, and CI verification before release-branch deployment.

No API repository, endpoint, database schema, or backend authorization behavior was changed. No live order, account, staff record, contact message, or feedback entry was submitted during validation.

## Verification evidence

Toolchain: Node 24.19.0, Angular/CLI 22.2.0, TypeScript 6.0.3, Vitest 4.1.11, Playwright 1.63.0, Chromium, Windows.

- Full unit suite: **94 tests passed across 35 files**, including the final cross-tab validation regression.
- Production build: passed with base href `/NATOS/`; generated `404.html` from the built entry point. Initial JS/CSS totaled 341.05 kB raw, with 96.16 kB estimated transfer size reported by Angular. Route chunks load separately; this is not total page transfer.
- Browser suite: 11 journeys passed against the production build, with all external requests intercepted. Coverage includes current quantity payloads, persistence, mixed/unknown outcomes, protected deep links, edit cancellation, failed saves, delete cancellation, asynchronous staff lists, multi-tab logout, and simultaneous cart submissions.
- Responsive checks: 360, 768, and 1440 CSS-pixel widths; public and staff pages do not overflow horizontally in the checked cases. A 720 CSS-pixel viewport checks the reflow space equivalent to a 1440px desktop at 200% zoom; it is not a physical browser zoom audit.
- Keyboard checks: public/staff menu Escape behavior, staff menu focus movement/return, skip link, and focusable main content. Reduced-motion styles are checked in Chromium.
- Visual review: desktop/mobile homepage, catalog, cart, and staff editor screenshots checked for layout, readable hierarchy, product image transparency, navigation, and form states. Browser runs save these screenshots under ignored `test-results/`.
- Whitespace check: `git diff --check` passed.

Reproduce using the commands in [README](../README.md). CI additionally uses `npm ci` and installs Chromium with its Linux system dependencies.

## Asset evidence and remaining release checks

The three unique homepage product WebPs total **82,060 bytes**; with the existing 10,390-byte logo, these image files total **92,450 bytes** (about 90.3 KiB). This is an on-disk asset count, not a browser transfer or Core Web Vitals result. The old homepage referenced two GIFs totaling 21,765,900 bytes plus a 5,998,720-byte wood image; the redesigned homepage does not request them.

The following remain environment/release checks, rather than claims of completed verification:

- No matched baseline/redesign Lighthouse run, throttled LCP/CLS comparison, field performance measurement, complete screen-reader audit, or WCAG certification was performed.
- Browser automation covers Chromium; Firefox, Safari, native browser zoom, and real-device behavior have not been exercised.
- Live API permissions, data shapes beyond existing contracts/fixtures, third-party form delivery, and production-host deep links need a deployment smoke check. Local preview tests exercise the `/NATOS/` 404 fallback without publishing.
- Client storage and Web Locks reduce duplicate attempts but cannot provide backend idempotency or an atomic multi-item order. Browsers without Web Locks refresh saved outcomes but cannot guarantee atomic cross-tab submission.
- Catalog prices are local reference values. Stock, transactional ordering, order tracking, refresh tokens, role provisioning, and server authorization remain separately scoped API work.

The changes are prepared locally on the feature branch. Production deployment requires the existing release-branch workflow; rollback is a frontend revert and redeployment with no database migration.
