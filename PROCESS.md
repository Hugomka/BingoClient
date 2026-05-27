# Process Log

## 2026-04-29 — Angular 18 Upgrade Issue

### What Was Attempted
Running `ng update @angular/core@18 @angular/cli@18` to upgrade the project to Angular 18.

### What Failed
```
An unhandled exception occurred: invalid: @angular/animations@11.2.4 C:\Dev\Bingo\BingoClient\node_modules\@angular\animations
```

### Root Cause
The failure was caused by two compounding problems:

1. **Partial manual edit of `package.json`:** The `dependencies` section had already been manually updated to Angular 18 (`^18.0.0`), but the `devDependencies` were never updated — `@angular/cli` was still `~11.2.3` and `@angular-devkit/build-angular` was still `~0.1102.3` (Angular 11 versions).

2. **Stale `node_modules`:** Because `npm install` was never re-run after the manual `package.json` edit, the actual installed packages in `node_modules` were still Angular 11.2.4. This caused a conflict between what `package.json` declared and what was physically installed.

`ng update` validates the installed package tree before running migrations. When it found `@angular/animations@11.2.4` installed while `package.json` expected `^18.0.0`, it considered the workspace invalid and aborted.

### Fix Applied

1. Updated `devDependencies` in `package.json` to Angular 18-compatible versions:
   - `@angular/cli`: `~11.2.3` → `^18.0.0`
   - `@angular-devkit/build-angular`: `~0.1102.3` → `^18.0.0`
   - `@angular/compiler-cli`: already `^18.0.0` ✓
   - `typescript`: updated to `~5.4.0` (required by Angular 18)
   - Updated test tooling (`jasmine-core`, `karma`, etc.) to current compatible versions

2. Deleted `node_modules` and `package-lock.json` to clear the stale state.

3. Ran a fresh `npm install`.

### Result
- Angular CLI: **18.2.21**
- Angular: **18.2.14**
- All `@angular-devkit/*` packages: **18.2.21**

### Lessons Learned

- **Never partially update `package.json` manually.** If you manually bump versions in `dependencies`, you must also update `devDependencies` (especially `@angular/cli`, `@angular-devkit/build-angular`, `@angular/compiler-cli`, and `typescript`) consistently before running `npm install`.
- **`ng update` is not a replacement for `npm install`.** It expects the installed `node_modules` to already match `package.json` before it can run migrations. If they are out of sync, it will reject the workspace.
- **Prefer using `ng update` from the start** rather than manually editing `package.json`, as it handles coordinated version bumping across all Angular packages automatically.
- **Node.js version matters:** Angular 18 officially supports Node 18.x and 20.x. The project is currently running on Node 24, which is unsupported. This has not caused issues yet but may in the future — consider pinning to Node 20 LTS via `nvm`.

---

## 2026-04-29 — Updating `angular.json` for Angular 18

### Context
After upgrading packages to Angular 18, `angular.json` also needed manual review and updates since `ng update` could not run the automatic migrations (due to the partial manual edit described above).

### What Was Deprecated or Removed

| Option / Builder | Status | Details |
|---|---|---|
| `defaultProject` | **Removed** | No longer a valid workspace-level extension in Angular 18 |
| `@angular-devkit/build-angular:browser` | **Deprecated** | Replaced by the new unified `application` builder |
| `main` (build option) | **Renamed** | → `browser` under the `application` builder |
| `polyfills` as a file path (`"src/polyfills.ts"`) | **Changed** | Now an inline array: `["zone.js"]` — `polyfills.ts` is no longer the entry point |
| `browserTarget` (serve/extract-i18n) | **Renamed** | → `buildTarget` |
| `aot`, `buildOptimizer`, `namedChunks`, `vendorChunk` | **Removed** | Always on in Angular 18; no longer configurable |
| `lint` with TSLint builder | **Removed** | TSLint is end-of-life; migrate to ESLint separately |
| `e2e` with Protractor builder | **Removed** | Protractor is end-of-life; no direct replacement in-scope |

### Changes Made

1. Removed `defaultProject` from the workspace root.
2. Switched build `builder` from `...build-angular:browser` → `...build-angular:application`.
3. Renamed `main` → `browser` in build options.
4. Changed `polyfills` in both `build` and `test` targets from a file path to an inline array (`["zone.js"]` / `["zone.js", "zone.js/testing"]`).
5. Renamed all `browserTarget` occurrences to `buildTarget` in `serve` and `extract-i18n`.
6. Removed deprecated scalar options (`aot`, `buildOptimizer`, `namedChunks`, `vendorChunk`).
7. Removed the `lint` (TSLint) and `e2e` (Protractor) architect targets entirely.

### Result
`ng build` completed successfully with no warnings or errors, producing a clean bundle under `dist/BingoClient`.

### Lessons Learned

- **`ng update` would have done this automatically.** All of these `angular.json` migrations are scripted in Angular's update schematics. Manually editing `package.json` before running `ng update` meant those schematics never ran, so the config had to be fixed by hand.
- **The `application` builder is not a drop-in rename.** Several option names changed (`main` → `browser`, `polyfills` as array) so a simple find-and-replace of the builder name would break the build.
- **`polyfills.ts` is now redundant.** The new `application` builder takes polyfill entry points directly in `angular.json`. The file can be kept for custom polyfills but should not be referenced as a build entry point.
- **Always verify with `ng build` after editing `angular.json`** — the schema is validated at runtime, not at edit time, so mistakes only surface when you actually build.

---

## 2026-04-29 — Step 2: Migrating to Standalone Architecture

### Context
With all components already marked `standalone: true`, the next step was to remove `AppModule`
and `AppRoutingModule`, wire up the app without them, and give each component its own `imports`.

### What Was Done

#### 1. Created `src/app/app.routes.ts`
Extracted the routes from `AppRoutingModule` into a plain routes array:
```typescript
export const routes: Routes = [
  { path: '',        component: BingoStartComponent },
  { path: 'play',    component: BingoCardComponent },
  { path: 'lead',    component: BingoMillComponent },
  { path: 'setting', component: BingoSettingComponent }
];
```

#### 2. Rewrote `src/main.ts`
Replaced the old `platformBrowserDynamic().bootstrapModule(AppModule)` with the standalone bootstrap:
```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
});
```
This is where `HttpClientModule` and `RouterModule.forRoot()` now live — as functional providers
at the application level, not inside a module.

#### 3. Added `imports: []` to every component
Each component now explicitly declares only what its own template uses:

| Component | Imports |
|---|---|
| `AppComponent` | `RouterOutlet` |
| `BingoBallComponent` | *(none — template is plain HTML)* |
| `BingoWindowComponent` | `NgClass`, `NgIf`, `FontAwesomeModule` |
| `BingoStartComponent` | `RouterLink`, `FontAwesomeModule`, `BingoWindowComponent` |
| `BingoCardComponent` | `NgIf`, `NgFor`, `BingoBallComponent`, `FontAwesomeModule`, `RouterLink` |
| `BingoMillComponent` | `NgIf`, `NgFor`, `BingoBallComponent`, `FontAwesomeModule`, `RouterLink` |
| `BingoSettingComponent` | `FontAwesomeModule`, `RouterLink` |

#### 4. Deleted `app.module.ts` and `app-routing.module.ts`
Both files are now fully replaced and were removed from the project.

### Result
`ng build` completed with zero errors. Bundle size dropped from **349 kB → 331 kB** immediately,
because tree-shaking can now precisely eliminate unused Angular features per component.

### Lessons Learned

- **Read the templates before adding imports.** The required imports for a component are determined
  by what directives, pipes, and child components its *template* uses — not what its TypeScript class imports.
  A good checklist: `*ngIf`/`*ngFor` → `NgIf`/`NgFor`; `[ngClass]` → `NgClass`; `routerLink` → `RouterLink`;
  `<router-outlet>` → `RouterOutlet`; `<app-*>` → import that component directly; `<fa-icon>` → `FontAwesomeModule`.
- **`HttpClientModule` moves to `provideHttpClient()` in `main.ts`.** It is no longer imported inside
  a component or module — it is registered once as an application-level provider.
- **`RouterModule.forRoot()` moves to `provideRouter(routes)` in `main.ts`.** Same principle.
- **Child components must be imported directly.** In the module world, declaring a component in `AppModule`
  made it available everywhere. In standalone, if component A uses `<app-b>` in its template,
  A must import B explicitly in its own `imports: []`.
- **The bundle gets smaller right away.** Even before any lazy loading is added, tree-shaking benefits
  are visible because the compiler now knows the exact dependency graph per component.

---

## 2026-05-12 — Step 3: Environment & Base Service

### What Was Done

1. **`environment.ts` was already correct** — `apiUrl` and `pollIntervalMs` had been set in an earlier session.

2. **Updated `environment.prod.ts`** to include both `apiUrl` and `pollIntervalMs` (it previously only had `production: true`).
   This ensures that a production build uses the same field names and a proper API URL can be swapped in later.

3. **Updated `bingo.service.ts`**:
   - Replaced the hard-coded `'http://localhost:8080/api'` string with `environment.apiUrl`.
   - Added `import { HttpErrorResponse } from '@angular/common/http'`.
   - Improved `handleError` to distinguish `HttpErrorResponse` from other errors and log the HTTP status code and message instead of the raw error object.

4. **Verified** with `ng build` — zero errors.

### Lessons Learned

- **`environment.prod.ts` must mirror every field in `environment.ts`.** Angular's file-replacement
  mechanism swaps the entire file at build time. If a field exists in `environment.ts` but not in
  `environment.prod.ts`, production code will get `undefined` for that field at runtime — no compile
  error, just a silent bug.
- **`HttpErrorResponse` gives structured error info.** Logging `error.status` and `error.message`
   from an `HttpErrorResponse` is far more useful in the console than `[object Object]`.

---

## 2026-05-27 — Step 4: JWT Authentication Complete & Git Fix

### Context
Step 4 (JWT Authentication) was completed — all auth-related files were created and integrated into the app.

### What Happened
A commit was made automatically during the implementation phase. This created a problem for local synchronization:
- Changes had been committed to the branch
- Local uncommitted changes needed to be preserved

### Fix Applied
Used `git reset --soft HEAD~1` to undo the most recent commit while keeping all the changes staged.
This allowed proper synchronization of the working directory without losing any implementation work.

### Additional Maintenance
The `.angular/` directory (Angular build cache) was added to `.gitignore` to prevent build artifacts 
from being tracked. This folder is generated locally during builds and should never be committed.

### Result
- ✅ Step 4 (JWT Authentication) is fully complete and all checkboxes are marked done in PLAN.md
- ✅ Git state is clean and in sync with local changes
- ✅ `.angular/` is now ignored in version control

---

## 2026-05-27 — Settings UI Modernization & Navigation Polish

### Context
After improving auth screens and global layout, the settings page still felt visually outdated
and had weaker usability patterns (low-contrast feel on dark context, left-leaning layout,
and home icon placement not aligned with user expectation).

### What Was Done

1. **Modernized `BingoSettingComponent` layout**
   - Replaced old left-aligned structure with a centered card layout.
   - Added clearer sections and spacing for better readability.
   - Standardized controls (swatches, segmented options, rounded inputs).

2. **Improved visual contrast and consistency**
   - High-contrast settings card on top of dark app background.
   - Updated button and input styling to match the rest of the refreshed UI.

3. **Moved Home icon to top-right**
   - Relocated home navigation icon from bottom action area to settings header.
   - This better matches common UX expectations for quick navigation.

4. **Aligned icon interaction behavior with Start page**
   - Added hover/active feedback to settings home icon:
     - hover scale: `1.1`
     - active press scale: `0.95`
     - subtle opacity change

5. **Updated documentation**
   - Added `Step 4.4 — Settings Page UX Modernization` to `PLAN.md`.

### Verification
- Ran `ng build` after the styling/layout updates.
- Build completed successfully and generated output in `dist/BingoClient`.

### Lessons Learned
- **Placement beats discoverability:** users strongly expect navigation affordances (like home)
  in predictable positions (top-right in this flow).
- **Micro-interactions matter:** consistent hover/press feedback across pages creates perceived quality.
- **Card-based composition improves readability** in dark-themed apps by reducing large low-contrast surfaces.
