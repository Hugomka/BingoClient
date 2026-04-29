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

