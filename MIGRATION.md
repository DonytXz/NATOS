# Angular migration

Target reached: Angular 22.0.8, migrated one major version at a time with a
production build after every step.

## Progress

- [x] Repair the mixed Angular 9/20/21/22 dependency manifest.
- [x] Angular 9.1 -> 10.2.
- [x] Angular 10.2 -> 11.
- [x] Angular 11 -> 12.
- [x] Angular 12 -> 13.
- [x] Angular 13 -> 14.
- [x] Angular 14 -> 15.
- [x] Angular 15 -> 16.
- [x] Angular 16 -> 17.
- [x] Angular 17 -> 18.
- [x] Angular 18 -> 19.
- [x] Angular 19 -> 20.
- [x] Angular 20 -> 21.
- [x] Angular 21 -> 22.

## Verification

| Version | Production build | Unit tests |
| --- | --- | --- |
| 9.1.13 | Pass | Not run |
| 10.2.5 | Pass | TypeScript/spec compilation passes |
| 11.2.14 | Pass | TypeScript/spec compilation passes |
| 12.2.17 | Pass | TypeScript/spec compilation passes |
| 13.4.0 | Pass | TypeScript/spec compilation passes |
| 14.3.0 | Pass | TypeScript/spec compilation passes |
| 15.2.10 | Pass | TypeScript/spec compilation passes |
| 16.2.12 | Pass | TypeScript/spec compilation passes |
| 17.3.12 | Pass | TypeScript/spec compilation passes |
| 18.2.14 | Pass | TypeScript/spec compilation passes |
| 19.2.25 | Pass | TypeScript/spec compilation passes |
| 20.3.27 | Pass | TypeScript/spec compilation passes |
| 21.2.18 | Pass | TypeScript/spec compilation passes |
| 22.0.8 | Pass | 32 files and 34 tests pass with Vitest |

## Notable migrations

- Replaced the Webpack browser builder with `@angular/build:application`.
- Converted legacy structural directives to Angular block control flow.
- Preserved the NgModule architecture with explicit `standalone: false`.
- Replaced Karma with Vitest and jsdom.
- Upgraded the View Engine-only `ngx-pagination` package to its Ivy release.
- Upgraded RxJS, Zone.js, tslib, and SweetAlert2.
- Removed the obsolete Angular 9 Node patch, TSLint, Karma, and Protractor
  dependencies. The old `e2e/` source remains only as reference.
- Production dependencies report zero npm audit vulnerabilities.
