# NATOS web app v2 plan

Planned: 2026-10-03 (America/Mexico_City). Baseline: `890ec18853af7df54d89d48954fb1127cab29ec5`, matching `origin/master` after fetching. Implementation branch: `codex/web-app-v2`.

Priority: a balanced redesign covering usability, visual polish, and reliability. The user approved implementation. This document preserves the original scope and acceptance targets; see [implementation and validation](web-app-v2-validation.md) for delivered changes, evidence, and remaining release checks.

## Outcome and scope

Make NATOS a clear Spanish-language pallet storefront with a dependable staff workspace, retaining Angular 22 and the existing API contracts. A visitor should understand the offering, find a product, review quantities and prices, and submit an order request without unexpected prompts. Staff should find records and edit them without risking unsaved changes to the displayed data.

In scope: Angular routes, layouts, components, forms, styles, local assets, browser state, frontend service adapters, accessibility, performance, frontend tests, and frontend CI/deployment configuration.

Out of scope: changes to `natos-api`, endpoints, database/schema, authentication protocol, server authorization, role provisioning, payments, authoritative stock/prices, order transactions, password-reset services, new email services, or sensor integrations. Do not use this redesign to switch frameworks or introduce a second application.

Preserve the existing external contact/feedback providers where they remain usable. Do not invent successful submissions, current commercial offers, customer accounts, backend capabilities, or operational metrics.

## Evidence behind the priorities

These are source findings unless explicitly marked as browser observations. Paths refer to the reviewed baseline.

1. **The framework migration is already complete.** [package.json](../package.json) and [MIGRATION.md](../MIGRATION.md) show Angular 22, TypeScript 6 and Vitest. Spend the next iteration on application behavior and design.
2. **Ordering can submit an outdated quantity.** [cartitem.component.ts](../src/app/cart/cartitem/cartitem.component.ts) snapshots the order payload in `ngOnInit`, but the template continues editing the cart item. It also asks for email through a browser prompt for every new line. Successful submission clears the payload while leaving the visible cart item.
3. **Editing is not isolated from saved data.** All seven management components bind their form to the selected table object. For example, `editEste` in [clientes.component.ts](../src/app/clientes/clientes.component.ts) assigns the row directly, and clearing the form mutates that object. Cancel/save semantics need correction.
4. **Session and registration UX need repair.** [login.service.ts](../src/app/servicios/login.service.ts) treats any nonempty stored token as a session. Logout in [sidenav.component.ts](../src/app/sidenav/sidenav.component.ts) does not navigate out of the active staff screen. The registration password field in [registrar.component.html](../src/app/registrar/registrar.component.html) is an ordinary text input; registration errors only reach the console.
5. **Public and staff navigation are mixed.** [sidenav.component.html](../src/app/sidenav/sidenav.component.html) changes “Catálogo” to “Pedidos” based on login. [catalogo.component.ts](../src/app/catalogo/catalogo.component.ts) navigates to `shop` during component initialization. Every feature is eagerly imported in [app-routing.module.ts](../src/app/app-routing.module.ts).
6. **The styling foundation is inconsistent.** [index.html](../src/index.html) loads Materialize, two Bootstrap versions, duplicated jQuery/Popper scripts and duplicated icon scripts. [styles.css](../src/styles.css) globally centers text over a fixed wood background. Navigation relies on imperative Materialize initialization.
7. **Media is disproportionately large.** Local source file sizes: `hd1.gif` 9,145,961 bytes, `hd2.gif` 12,619,939 bytes, and `roble.jpg` 5,998,720 bytes. All three appear on the homepage. These are file sizes, not measured page-transfer or performance scores. The first two alone total about 20.8 MiB.
8. **Content and form details undermine trust.** The document title is “Proyecto”; the menu shows a sample guest email; Nosotros contains placeholder copy. [contacto.component.html](../src/app/contacto/contacto.component.html) labels a required phone field optional, displays a placeholder number, and uses a different WhatsApp recipient in its component. Monitoring embeds reuse the same channel under two warehouse labels.
9. **Verification covers creation more than behavior.** Existing specs primarily check component/service creation. [gh-pages.yml](../.github/workflows/gh-pages.yml) builds and deploys on main/master pushes without PR unit checks. There is no tracked lockfile, and the Protractor files are retired.

The deployed homepage was opened read-only at [donatoalvarez.dev/NATOS/Inicio](https://donatoalvarez.dev/NATOS/Inicio), reached through the GitHub Pages URL. Its rendered view confirms icon-only account controls, the wood background, and a large animated hero occupying most of the initial viewport. Authenticated screens, live ordering, mobile breakpoints, and external form delivery were not exercised. There is no claim of measured conversion impact or a completed accessibility audit.

## Product and visual direction

Use a restrained industrial identity: preserve the NATOS logo, use charcoal text, warm white surfaces, one wood/amber accent, clear sans-serif typography, and real pallet photography. Keep body copy left-aligned, reduce ornamental motion, and reserve strong color for primary actions and meaningful status. Use shared spacing, type, color, radius, focus, and control-size tokens.

Build one set of Angular-managed buttons, labeled fields, error messages, notices, dialogs, tables, pagination, loading states, and empty states. Prefer semantic HTML and locally bundled styles/icons; do not add another broad CSS framework over the existing two. Replace legacy classes feature by feature, then remove their CDN dependencies when the final consumer is gone.

### Visitor experience

- **Header:** Inicio, Catálogo, Nosotros, Contacto; a labeled cart with item count; secondary “Acceso del personal”. Feedback remains a secondary contact/footer link.
- **Inicio:** concise value proposition, useful product imagery, a prominent “Ver catálogo” action, contact access, and short company/process information. Publish only evidenced business claims.
- **Catálogo:** clean product cards showing bundle size, price unit, MXN price, and add action. Support simple search/sort over the eight existing products; add filters only for attributes actually represented in the local data. Product details may expand inline without requiring a new backend resource.
- **Carrito:** editable integer quantities, remove action, derived totals, empty state, and browser-local persistence for non-sensitive item selections. Collect the order email once during explicit review; do not persist that email by default.
- **Order review/result:** clear contact and line summary, pending state, and per-line outcomes. Use “Enviar solicitud de pedido”; do not imply payment, reserved stock, or a confirmed delivery promise.
- **Contacto/Nosotros/Sugerencias:** readable factual content, labeled inputs, consistent verified contact destinations, responsive embeds with titles and fallback links.

### Staff experience

A separate staff shell keeps the public storefront accessible even while signed in. It uses a compact sidebar and content header, rather than decorative banners on each management screen.

- **Pedidos:** existing order records, explicit loading/failure/empty states, readable status and contact fields. Preserve supported operations only.
- **Inventario:** Tarimas and Artículos.
- **Operaciones:** Ventas and Compras.
- **Directorio:** Clientes, Proveedores and Empleados.
- **Herramientas:** feedback and temperature embeds, with their current data limitations visible.
- **Account:** clear session state and logout. Treat registration as existing staff onboarding with a code, not customer signup; preserve its route and contract pending better product evidence.

Each management page is list-first: heading, search over loaded records, “Nuevo…” action, a useful table, then a focused create/edit form with Save and Cancel. Use entity-specific forms and shared visual components, rather than a highly abstract CRUD generator. Search must not claim to cover records the API has not returned.

## Routing and frontend structure

Introduce public and staff layout routes, keeping old bookmarked URLs as explicit redirects. Proposed canonical routes are `/inicio`, `/catalogo`, `/carrito`, `/nosotros`, `/contacto`, `/sugerencias`, `/acceso`, `/registro`, and `/admin/...` for staff features. Preserve `/Copy` until its purpose is checked; do not silently delete existing routes.

Map `/Inicio`, `/Nosotros`, `/Catalogo`, `/Contacto`, `/Sugerencias`, `/Iniciar`, and `/Registrar` to their equivalents. Map `/Tarimas`, `/Articulos`, `/Compras`, `/Ventas`, `/Clientes`, `/Proveedores`, `/Empleados`, and `/temp` to the staff shell. Preserve the legacy `/shop` entry as a deliberate compatibility redirect: visitors reach the catalog and existing signed-in staff reach orders. New navigation uses unambiguous destinations. Unknown URLs get a real not-found page.

Suggested organization, introduced incrementally:

```text
src/app/
  core/          # auth state, existing-API adapters, request error handling
  shared/ui/     # reusable visual and accessible interaction primitives
  layouts/       # public and staff navigation shells
  features/
    storefront/  # home, catalog, cart, order review
    auth/        # sign-in and existing registration
    management/  # orders and the seven record-management areas
    content/     # about, contact, feedback, monitoring
```

Lazy-load feature boundaries. Keep the existing NgModule bootstrap until a touched feature benefits from standalone conversion; a wholesale standalone rewrite is not a prerequisite. Centralize cart and session state in services using one consistent reactive approach. Components should not be injected as root services. Use typed forms/DTOs, explicit mapping at the API boundary, managed subscriptions, and progressive stricter type/template checks.

## Existing API boundary

Keep the environment-based API origin and current methods, paths, and payload field names. Derive fixtures and DTOs from current services and observed response shapes; document uncertainties instead of guessing.

- Order insertion currently uses `POST /carrito/insertar` with `id`, `name`, `quantity`, `price`, `status`, and `correo`. Order consultation uses `GET /carrito/consultar`; the service also defines a PUT there. Do not infer unsupported status transitions from the existence of that method.
- Catalog products/prices are eight hardcoded entries. The Tarimas management endpoint is a separate contract; it must not automatically become the storefront catalog or stock source.
- A single review screen may sequence existing per-line insertions. Track each line as pending, succeeded, definitively failed, or outcome unknown. On mixed results, retain unresolved lines, identify completed ones, and never resend completed lines automatically. A timeout can occur after server acceptance; instruct users to verify an unknown outcome before attempting another submission. No frontend-only strategy guarantees server idempotency or an atomic cart order.
- Login currently returns a value read as `jwtoken`. Validate that shape, centralize session updates, and handle logout/401 consistently. Use expiry only if the existing token actually provides it. Do not assume new claims, roles, refresh endpoints, or an Authorization header contract. Attach credentials only in the way already supported by the existing API, scoped to its origin.
- Staff pages must not fetch operational collections during anonymous storefront browsing. Hiding controls and route guards improve navigation but cannot establish server-side authorization.
- Contact and feedback already depend on Formspree/Google services. Preserve working integration semantics and expose unavailable states; a replacement submission backend is outside this release.

## Delivery sequence

Effort bands indicate relative complexity, not elapsed-time commitments: S is a focused change, M spans a feature, and L spans several coordinated workflows. Deliver each slice with its own acceptance evidence. Steps 1 and 2 can start independently; step 3 establishes patterns for steps 4 and 5; step 6 closes the release.

### 1. Reproducible baseline and regression coverage — M

Pin a compatible Node version for local/CI use, commit a generated lockfile, use deterministic installation, and add PR checks for unit tests and the production build. Capture existing endpoint/payload fixtures. Add behavioral regression coverage for current cart quantities, edit/cancel, session/logout, and form failures before restructuring those flows. Keep automatic production deployment limited to the release branch.

Done when: a clean install reproduces the app; PR checks run without deployment; regressions fail when the known mistakes are reintroduced; the production base path remains `/NATOS/`.

### 2. Repair existing workflows — M

Build order payloads from current validated values at submit time, capture email explicitly, suppress duplicate pending submissions, and preserve input on error. Fix password input and visible registration errors. Separate edit drafts from displayed records across all seven modules, add safe cancellation, and name the record in delete confirmation. Centralize logout/session updates and stop anonymous order-list requests. Replace destructive body-HTML printing with print styles.

Done when: adding a product never opens a prompt; changing quantity from 1 to 3 submits 3; invalid quantities cannot submit; cancel leaves the row unchanged; failed saves retain the draft; logout exits the staff screen; print preserves cart state.

### 3. Shared visual system and navigation — L

Implement tokens, public/staff shells, responsive menus, and the shared fields/notices/dialog/table primitives. Add explicit route redirects, page titles, lazy feature boundaries, and not-found handling. Replace global layout assumptions incrementally and remove duplicated CDN assets only after remaining consumers are accounted for.

Done when: a visitor can discover the catalog without opening an unlabeled control; staff navigation has stable labels; menus/dialogs work with keyboard and focus return; old URLs remain usable; migrated screens do not depend on global jQuery/Materialize initialization.

### 4. Customer storefront and order review — L

Rebuild Inicio and Catálogo with optimized imagery, clear bundle units and consistent MXN formatting. Add durable non-sensitive cart state and the explicit review/results flow over the existing per-item endpoint. Consolidate factual contact/about content and keep feedback reachable. Remove obsolete promotional claims unless their source is verified.

Done when: a visitor can browse, add, edit, review and submit against mocked existing contracts; mixed success and uncertain outcomes are displayed accurately; cart state survives navigation/reload; no payment or stock guarantee is implied.

### 5. Staff workspace rollout — L

Use Clientes as the first complete list/form pilot because it exercises the common CRUD pattern with limited domain complexity. Extend it to Proveedores, Empleados, Tarimas, Artículos, Compras and Ventas, retaining each entity's actual fields and semantics. Move Pedidos into its own screen. Adapt auxiliary embeds after core workflows work.

Done when: every existing management action remains reachable; create/edit/cancel/delete, validation and request states are consistent; filtering/pagination describe loaded data accurately; both narrow and wide layouts remain usable. Do not add unsupported dashboard KPIs or bulk mutations.

### 6. Release validation and asset cleanup — M

Complete browser journey tests with mocked API responses, responsive/keyboard/manual visual checks, accessible name/contrast checks, content review, and production deep-link testing. Optimize/re-encode existing assets and exclude source-only PSD files from shipped assets. Remove unused framework scripts, dead initialization and retired tooling only after references are checked.

Done when: all release gates below pass and the change can be reverted as a frontend deployment without any database migration.

## Release gates

- **Behavior:** tests cover cart add/edit/remove, current-value submission, validation, partial/unknown results, no duplicate pending requests, persistence, create/edit/cancel/delete, login failure, malformed login result, logout, and 401 handling where the API returns it.
- **Access boundaries:** anonymous storefront browsing does not request staff lists; protected deep links lead to sign-in and preserve a safe return path. No claim is made that client guards secure the API.
- **Responsive use:** check 360, 768 and 1440 CSS-pixel widths and 200% zoom. No page-wide horizontal overflow; large tables scroll within a labeled region or render labeled record cards.
- **Accessibility:** persistent field labels, associated validation errors, descriptive icon controls, semantic tables/headings/landmarks, visible focus, keyboard-operable menus/dialogs, live result announcements, and reduced-motion behavior. Use WCAG AA contrast targets; automation is supplemented by manual review, not treated as certification.
- **Performance:** record repeatable lab results for the baseline and redesigned Inicio/Catálogo using the same viewport and throttling. Proposed budgets: at most 1 MiB of initial homepage imagery, no decorative GIF over 1 MiB in a core flow, and an initial JavaScript bundle no larger than the measured baseline. Aim for mobile lab LCP <= 2.5 s and CLS <= 0.1; these are targets, not measured results or field guarantees. Review hosting/third-party contributions before assigning regressions to the app.
- **Resilience/content:** loading, empty, pending and failure states are explicit; third-party embeds have titles and useful fallback links; contact numbers and business claims come from a verified source or are omitted. Production has no Lorem ipsum or sample guest identity.
- **Deployment:** production build and tests pass with pinned tooling; direct navigation and refresh work for public and staff paths under `/NATOS/`, including the GitHub Pages 404 fallback; the custom-domain path remains valid. Roll back by reverting the frontend release and redeploying the last known-good version.

## Assumptions and deferred dependencies

Proceed with the balanced direction above without routine confirmation pauses. Preserve the existing Spanish locale and logo; business content that cannot be verified is omitted or kept out of release. New role claims, a customer account system, transactional orders, reliable retry/idempotency, authoritative pricing/stock, order tracking, and secure operational authorization belong to a separately scoped API phase. Record any such blocker without expanding this implementation into backend work.

No time estimate is committed until the first baseline/pilot slice confirms contract behavior and component effort. The release can be delivered in small frontend pull requests; route areas should be switched only when each complete journey passes its tests.

## Verification of this planning baseline

- The working tree was clean before creating the planning branch; `HEAD` and fetched `origin/master` matched.
- Public repository source and the deployed homepage were inspected. No production order, account, record, contact message, or feedback entry was submitted.
- Default local Node `v24.11.1` is rejected by the Angular CLI's required engine range. Baseline verification used bundled Node `v24.19.0`: all 34 unit tests passed and the production build passed.
- The baseline above describes the planning checkpoint. Web app implementation is now on this branch; the API remains outside its scope.
