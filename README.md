# NATOS web app

Spanish-language pallet storefront and staff workspace built with Angular 22 and TypeScript 6. The v2 redesign adds separate public/staff navigation, a persistent order-request cart, responsive layouts, and consistent record editing with recoverable errors.

The API, database, endpoint paths, and existing payload contracts are unchanged. Catalog prices remain local reference data; submitting a request does not collect payment or reserve stock.

## Run locally

Use Node **24.19.0**, pinned in `.nvmrc`, and npm. The lockfile pins the dependency tree.

```sh
npm ci
npm start
```

Open `http://localhost:4201/`. Production uses `/NATOS/` as its base path.

## Verify and preview

```sh
npm test
npm run build:production
npx playwright install chromium
npm run test:e2e
npm run preview
```

The preview opens at `http://127.0.0.1:4301/NATOS/`. Build output is `dist/proyecto/browser`; the production build also creates the GitHub Pages `404.html` fallback. Run the build before browser tests. Playwright starts the local preview server and intercepts external requests, so its fixtures do not create production records.

Unit tests use Vitest and jsdom. Browser tests cover the storefront, order outcomes, authentication, staff editing, mobile navigation, and deep links. Historical Protractor files under `e2e/` are retained as reference; the active suite is `e2e/browser/`.

## Application structure

- `layouts/`: public header/footer and staff navigation.
- `core/cart-state.service.ts`: cart validation, persistence, and per-product request outcomes.
- `servicios/`: adapters for the existing API; session state and API 401 handling live in `login.service.ts`.
- `shared/ui/`: consistent record workspace with independent drafts, validation, pagination, and named deletion confirmation.
- Existing feature folders retain their paths and load as standalone components. `features/orders/` contains the staff order list.

Public routes include `/inicio`, `/catalogo`, `/carrito`, `/nosotros`, `/contacto`, `/sugerencias`, `/acceso`, `/registro`, and `/creditos`. Staff routes live under `/admin/`. Legacy capitalized URLs and `/shop` redirect to the corresponding experience.

The cart stores product IDs, quantities, and delivery outcomes in browser storage; it does not persist the order email. Completed requests are not sent again automatically. An ambiguous response requires checking with NATOS before retrying. Client route guards retain the existing session contract and do not establish server authorization.

## Delivery

Pull requests run deterministic installation, unit tests, production build, and Chromium browser tests. Verified pushes to `main` or `master` can deploy to `gh-pages`; feature branches do not deploy. Rollback requires only reverting the frontend release and redeploying.

See the [v2 plan](docs/web-app-v2-plan.md), [implementation and validation](docs/web-app-v2-validation.md), and [earlier Angular migration](MIGRATION.md).
