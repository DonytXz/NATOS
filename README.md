# Proyecto

This project runs on Angular 22.0.8 and TypeScript 6. See
[MIGRATION.md](MIGRATION.md) for the completed version-by-version migration
and verification results.

Use Node.js 22.22.3+, 24.15+, or 26+.

## Development server

Run `npm start` (or `ng serve`) for a dev server. Navigate to
`http://localhost:4201/`. Port 4201 is configured for this project so it does
not conflict with other Angular applications that commonly use port 4200. The
app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to create a development build, or
`npm run build -- --configuration production` for a production build. Output
is written to `dist/proyecto/`.

## Running unit tests

Run `npm test` to execute the 34 unit tests with Vitest and jsdom.

## Running end-to-end tests

The retired Protractor source remains in `e2e/` as migration reference, but
there is no active end-to-end runner. Add Playwright or another maintained
runner when rebuilding those tests.

## Further help

Run `npx ng help` or consult the [Angular CLI documentation](https://angular.dev/tools/cli).
