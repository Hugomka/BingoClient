# BingoClient — Software Design & Implementation Plan

> **Stack:** Angular 18 LTS · Standalone Components · JWT Auth · HTTP Polling  
> **Author:** Hugo Mkandawire  
> **Last updated:** 2026-04-29  
> **Strategy:** Build BingoClient first → use it as the contract for BingoServer → then BingoAndroid.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Data Models](#3-data-models)
4. [API Contract](#4-api-contract)
5. [Routing Table](#5-routing-table)
6. [Component Responsibilities](#6-component-responsibilities)
7. [Authentication Flow](#7-authentication-flow)
8. [Live Draw Strategy — HTTP Polling](#8-live-draw-strategy--http-polling)
9. [Angular CDK Dialog](#9-angular-cdk-dialog)
10. [Implementation Checklist](#10-implementation-checklist)
11. [Known Bugs to Fix](#11-known-bugs-to-fix)
12. [BingoServer Contract (written by BingoClient)](#12-bingoserver-contract-written-by-bingoclient)

---

## 1. Project Overview

BingoClient is the **browser frontend** of a three-part Bingo platform. The client will be built
first so that its data models, routes, and API calls will define the contract that BingoServer
and BingoAndroid must implement later.

| Project       | Technology       | Status      | Role                                   |
|---------------|------------------|-------------|----------------------------------------|
| BingoClient   | Angular 18 LTS   | 🔨 Active   | Player & game-leader web UI            |
| BingoServer   | Spring Boot      | ⏳ Later    | REST API, game state, user management  |
| BingoAndroid  | Android (Kotlin) | ⏳ Later    | Mobile player card                     |

### Two User Personas

| Persona         | Dutch label  | Responsibility                                             |
|-----------------|--------------|------------------------------------------------------------|
| **Player**      | Deelnemer    | Joins a game, receives a card, stamps numbers, calls Bingo |
| **Game leader** | Spelleider   | Opens/closes the mill, triggers draws, watches winners     |

---

## 2. Architecture

### Folder Structure (target state)

```
src/
├── environments/
│   ├── environment.ts          ← add apiUrl + pollIntervalMs
│   └── environment.prod.ts
├── app/
│   ├── main.ts                 ← bootstrapApplication (standalone, no AppModule)
│   ├── app.routes.ts           ← replaces app-routing.module.ts
│   ├── app.component.ts        ← standalone root component
│   │
│   ├── auth/                   ← NEW
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   └── login.component.html
│   │   ├── auth.service.ts
│   │   ├── auth.interceptor.ts
│   │   └── auth.guard.ts
│   │
│   ├── shared/                 ← NEW
│   │   └── username-dialog/
│   │       ├── username-dialog.component.ts
│   │       └── username-dialog.component.html
│   │
│   ├── bingo-ball/             ← display only, driven by @Input()
│   ├── bingo-card/             ← Player view  (/play)
│   ├── bingo-mill/             ← Game-leader view (/lead)
│   ├── bingo-setting/          ← Settings view (/setting)
│   ├── bingo-start/            ← Home / landing view (/)
│   │
│   ├── enums/
│   │   └── card-type.ts
│   ├── interfaces/
│   │   ├── bingo-card.ts
│   │   ├── bingo-mill.ts
│   │   ├── bingo-row.ts
│   │   ├── bingo-user.ts
│   │   └── auth.ts             ← NEW  (LoginRequest, LoginResponse)
│   └── services/
│       ├── bingo.service.ts    ← base class (apiUrl from env, error handler)
│       ├── bingo-card.service.ts
│       ├── bingo-mill.service.ts
│       ├── bingo-setting.service.ts
│       └── bingo-user.service.ts
│
└── testing/
    └── mock-bingo-card.ts      ← moved here, only used in unit tests
```

### What will be removed

| File / folder            | Reason                                                |
|--------------------------|-------------------------------------------------------|
| `app.module.ts`          | Will be replaced by `bootstrapApplication` in `main.ts` |
| `app-routing.module.ts`  | Will be replaced by `app.routes.ts`                   |
| `bingo-window/`          | Will be replaced by Angular CDK Dialog                |
| `mock-bingo-card.ts`     | Will be moved to `src/testing/` (test-only)           |

---

## 3. Data Models

### Existing interfaces (keep, no changes needed)

```typescript
// interfaces/bingo-user.ts
export interface BingoUser {
  id: string;
  username: string;
  backgroundColor: string;
}

// interfaces/bingo-row.ts
export interface BingoRow {
  id: string;
  numbers: string;  // comma-separated, e.g. "12, 24, *, 56, 68"  (* = free space)
}

// interfaces/bingo-card.ts
export interface BingoCard {
  id: string;
  bingoRows: BingoRow[];
  bingoUser: BingoUser;
}

// interfaces/bingo-mill.ts
export interface BingoMill {
  minimumNumber: number;
  maximumNumber: number;
  cardType: CardType;
}

// enums/card-type.ts
export enum CardType { default, random, special }
```

### New interfaces (create these)

```typescript
// interfaces/auth.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;   // JWT
  userId: string;
}
```

---

## 4. API Contract

The base URL will be read from `environment.apiUrl` (default: `http://localhost:8080/api`).  
All endpoints except `/auth/login` will require the `Authorization: Bearer <token>` header —
this will be added automatically by `AuthInterceptor`.

### Auth

| Method | Endpoint       | Request Body  | Response       |
|--------|----------------|---------------|----------------|
| POST   | /auth/login    | LoginRequest  | LoginResponse  |

### BingoUser

| Method | Endpoint             | Request Body | Response  |
|--------|----------------------|--------------|-----------|
| POST   | /bingoUser/create    | BingoUser    | BingoUser |
| GET    | /bingoUser/:id       | —            | BingoUser |
| PATCH  | /bingoUser/update    | BingoUser    | BingoUser |

### BingoCard

| Method | Endpoint                   | Request Body | Response    |
|--------|----------------------------|--------------|-------------|
| POST   | /bingoCard/create          | BingoCard    | BingoCard   |
| PATCH  | /bingoCard/update          | BingoCard    | BingoCard   |
| GET    | /bingoCard/                | —            | BingoCard[] |
| GET    | /bingoCard/:id             | —            | BingoCard   |
| DELETE | /bingoCard/:id             | —            | boolean     |
| GET    | /bingoCard/:id?callBingo   | —            | boolean     |

### BingoMill

| Method | Endpoint            | Request Body | Response  |
|--------|---------------------|--------------|-----------|
| GET    | /bingoMill/open     | —            | BingoMill |
| GET    | /bingoMill/:id      | —            | BingoMill |
| PATCH  | /bingoMill/update   | BingoMill    | BingoMill |
| DELETE | /bingoMill/:id      | —            | boolean   |

> **Note for BingoServer:** This table is the contract BingoServer must implement.
> The `/auth/login` endpoint does not exist yet. Until it does, `AuthService` will
> use a stub method — see §7.

---

## 5. Routing Table

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'login',   component: LoginComponent },
  { path: '',        component: BingoStartComponent,   canActivate: [AuthGuard] },
  { path: 'play',    component: BingoCardComponent,    canActivate: [AuthGuard] },
  { path: 'lead',    component: BingoMillComponent,    canActivate: [AuthGuard] },
  { path: 'setting', component: BingoSettingComponent, canActivate: [AuthGuard] },
  { path: '**',      redirectTo: '' }
];
```

---

## 6. Component Responsibilities

| Component              | Route     | Responsibility                                                                                      |
|------------------------|-----------|-----------------------------------------------------------------------------------------------------|
| `LoginComponent`       | /login    | Username + password form → calls `AuthService.login()` → navigates to `/`                          |
| `BingoStartComponent`  | /         | Landing page; shows "Deelnemen" button (→ CDK Dialog for username) and Spelleider link (→ `/lead`) |
| `BingoCardComponent`   | /play     | Loads player's BingoCard from server; polls for drawn numbers; auto/manual stamp; calls Bingo       |
| `BingoMillComponent`   | /lead     | Opens mill via server; controls draw timer (polling); shows drawn numbers grid and winners          |
| `BingoBallComponent`   | (child)   | **Display only** — receives `@Input() drawnNumber` and `@Input() drawnNumbers`, no draw logic      |
| `BingoSettingComponent`| /setting  | Edits username and background colour; persists changes to server and localStorage                   |

---

## 7. Authentication Flow

```
App starts
  └─► AuthGuard checks localStorage for JWT token
        ├─ No token  ──► redirect to /login
        └─ Has token ──► allow navigation

LoginComponent
  └─► User fills in username + password
        └─► AuthService.login() → POST /auth/login
              ├─ success: store token + userId in localStorage → navigate to /
              └─ failure: show error message

Every HTTP request
  └─► AuthInterceptor reads token from localStorage
        └─► adds header: Authorization: Bearer <token>

On 401 response
  └─► AuthInterceptor clears localStorage → redirects to /login
```

### Files to create

**`auth/auth.service.ts`**
```typescript
// Key methods:
login(req: LoginRequest): Observable<void>   // POST, store token
logout(): void                               // clear localStorage, navigate /login
isLoggedIn(): boolean                        // check token exists
getToken(): string | null
getUserId(): string | null

// Temporary stub until BingoServer has the endpoint:
stubLogin(username: string): void            // stores a fake token for offline development
```

**`auth/auth.interceptor.ts`**
```typescript
// Functional interceptor (Angular 15+ style):
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) { /* clear + redirect */ }
      return throwError(() => err);
    })
  );
};
```

**`auth/auth.guard.ts`**
```typescript
// Functional guard (Angular 15+ style):
export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};
```

**`auth/login/login.component.ts`** — reactive form with `username` and `password` fields.

### Registration in `main.ts`

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
});
```

---

## 8. Live Draw Strategy — HTTP Polling

The game leader draws a ball every N seconds. The player view must reflect the latest drawn number.

### Why polling (not WebSocket) for now

| | HTTP Polling | WebSocket |
|---|---|---|
| Server changes needed | ❌ None | ✅ Requires new WS endpoint |
| Client complexity | Low — `interval` + HTTP GET | Higher — persistent connection setup |
| Good enough for Bingo? | ✅ Yes, 5-second delay is acceptable | Overkill for now |
| Migration effort later | Swap one service method | Components will stay untouched |

**Conclusion:** Polling will be used for now. When BingoServer is upgraded, swapping `interval + GET`
for a WebSocket stream inside `BingoMillService` will be sufficient — the components will stay untouched.

### Implementation pattern

```typescript
// In BingoMillComponent:
private pollSub!: Subscription;

ngOnInit(): void {
  this.bingoMillService.open().subscribe(mill => {
    this.bingoMill = mill;
    this.millId = mill.id;       // BingoMill needs an id field — add it
    this.startPolling();
  });
}

startPolling(): void {
  this.pollSub = interval(environment.pollIntervalMs)
    .pipe(switchMap(() => this.bingoMillService.get(this.millId)))
    .subscribe(mill => this.bingoMill = mill);
}

pauseTimer(): void  { this.pollSub.unsubscribe(); }
startTimer(): void  { this.startPolling(); }

ngOnDestroy(): void {
  this.pollSub?.unsubscribe();
  this.bingoMillService.close(this.millId).subscribe();
}
```

### Add to `environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  pollIntervalMs: 5000
};
```

### Future WebSocket migration (in `BingoMillService` only)

```typescript
// Replace interval + GET with:
getStream(millId: string): Observable<BingoMill> {
  return new Observable(observer => {
    const ws = new WebSocket(`ws://localhost:8080/ws/bingoMill/${millId}`);
    ws.onmessage = e => observer.next(JSON.parse(e.data));
    ws.onerror   = e => observer.error(e);
    ws.onclose   = ()  => observer.complete();
    return () => ws.close();
  });
}
```

---

## 9. Angular CDK Dialog

The custom `BingoWindowComponent` will be replaced with Angular CDK `Dialog`.

### Install

```bash
ng add @angular/cdk
```

### New shared component

Create `src/app/shared/username-dialog/username-dialog.component.ts`:

```typescript
@Component({
  standalone: true,
  selector: 'app-username-dialog',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <h2>{{ data.prompt }}</h2>
    <input [formControl]="nameControl" (keyup.enter)="submit()" />
    <button (click)="submit()">OK</button>
    <button (click)="dialogRef.close()">Annuleren</button>
  `
})
export class UsernameDialogComponent {
  nameControl = new FormControl('', Validators.required);
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: { prompt: string }
  ) {}
  submit(): void {
    if (this.nameControl.valid) this.dialogRef.close(this.nameControl.value!);
  }
}
```

### Usage in `BingoStartComponent`

```typescript
// Replace the old BingoWindowComponent event pattern:
participate(): void {
  const ref = this.dialog.open<string>(UsernameDialogComponent, {
    data: { prompt: 'Beste deelnemer, kun je hier je naam invullen?' }
  });
  ref.closed.subscribe(username => {
    if (username) this.createUserAndNavigate(username);
  });
}
```

---

## 10. Implementation Checklist

The steps below are ordered by dependency — each one can be a separate Git commit.

---

### ✅ Step 1 — Upgrade to Angular 18

- [ ] Update `package.json` to Angular 18 LTS:
  ```
  @angular/core, @angular/cli, @angular/compiler, etc. → ^18.0.0
  @fortawesome/angular-fontawesome → ^0.15.0
  zone.js → ^0.14.0
  rxjs → ^7.8.0
  tslib → ^2.6.0
  ```
- [ ] Run: `ng update @angular/core@18 @angular/cli@18`
- [ ] Update `tsconfig.json`:
  - `"target": "ES2022"`
  - `"module": "ES2022"`
  - `"useDefineForClassFields": false`
- [ ] Update `angular.json` — remove any deprecated builder options
- [ ] Run `ng build` and fix any reported errors before continuing

---

### ✅ Step 2 — Standalone Architecture

> Angular 18 strongly prefers standalone components. This step should be completed fully before adding new features.

- [ ] Add `standalone: true` to every existing component's `@Component` decorator
- [ ] Move shared imports into each component's own `imports: []` array:
  - `RouterModule` / `RouterLink` / `RouterOutlet`
  - `CommonModule` (or individual `NgIf`, `NgFor`)
  - `FontAwesomeModule`
  - `ReactiveFormsModule` / `FormsModule` where needed
- [ ] Create `src/app/app.routes.ts` (see §5 for content)
- [ ] Rewrite `src/main.ts`:
  ```typescript
  import { bootstrapApplication } from '@angular/platform-browser';
  import { provideRouter } from '@angular/router';
  import { provideHttpClient } from '@angular/common/http';
  import { AppComponent } from './app/app.component';
  import { routes } from './app/app.routes';

  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(),
    ]
  });
  ```
- [ ] Delete `app.module.ts` and `app-routing.module.ts`
- [ ] Run `ng build` — must compile without errors
- [ ] Manually verify all four routes still work

---

### ✅ Step 3 — Environment & Base Service

- [ ] Update `src/environments/environment.ts`:
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api',
    pollIntervalMs: 5000
  };
  ```
- [ ] Update `src/environments/environment.prod.ts` with `production: true` and the production URL
- [ ] Update `bingo.service.ts`:
  ```typescript
  import { environment } from '../../environments/environment';
  protected URL = environment.apiUrl;
  ```
- [ ] Improve `handleError` to log `HttpErrorResponse` status and message instead of the raw error object

---

### ✅ Step 4 — JWT Authentication

- [ ] Create `src/app/interfaces/auth.ts` (see §3)
- [ ] Create `src/app/auth/auth.service.ts` (see §7)
- [ ] Create `src/app/auth/auth.interceptor.ts` (see §7)
- [ ] Create `src/app/auth/auth.guard.ts` (see §7)
- [ ] Create `src/app/auth/login/login.component.ts` + `.html`
  - Reactive form: `username` + `password` fields
  - Call `AuthService.login()` on submit
  - Show inline error message on failure
- [ ] Add `/login` route to `app.routes.ts`
- [ ] Add `AuthGuard` to all protected routes
- [ ] Register `authInterceptor` in `main.ts` with `provideHttpClient(withInterceptors([authInterceptor]))`
- [ ] **Stub test:** verify that navigating to `/` without a token redirects to `/login`
- [ ] **Stub test:** verify that after `stubLogin()` all routes are reachable

---

### ✅ Step 5 — Complete BingoMillComponent (Spelleider)

- [ ] Add `id` field to `BingoMill` interface (required to poll by ID)
- [ ] Inject `BingoMillService` into `BingoMillComponent`
- [ ] Remove `BingoBallComponent` `@ViewChild` — ball is now display-only
- [ ] On `ngOnInit`: call `BingoMillService.open()`, store `millId`, start polling
- [ ] Implement `startPolling()` with `interval + switchMap` (see §8)
- [ ] Wire `startTimer()` → restart polling, `pauseTimer()` → unsubscribe
- [ ] On `ngOnDestroy`: unsubscribe + call `BingoMillService.close(millId)`
- [ ] Pass the current drawn number down to `BingoBallComponent` via `@Input()`
- [ ] Display `participantsCounter` from server response (add to `BingoMill` interface if needed)
- [ ] Display `winner1`, `winner2`, `winner3`, `winnerFull` from server response

---

### ✅ Step 6 — Refactor BingoBallComponent to Display-Only

- [ ] Remove all draw logic from `BingoBallComponent`
- [ ] Add `@Input() drawnNumber: number`
- [ ] Add `@Input() drawnNumbers: number[]`
- [ ] Add `@Input() paused: boolean`
- [ ] Add `@Input() timerCounter: number`
- [ ] Remove `drawNumber()` and `containNumber()` methods (move `containNumber` to parent if still needed)
- [ ] Update `BingoMillComponent` and `BingoCardComponent` templates to pass these inputs

---

### ✅ Step 7 — Complete BingoCardComponent (Player)

- [ ] On `ngOnInit`: read `userId` from localStorage → call `BingoCardService.get(userId)` (or `create()` on 404)
- [ ] Add a polling subscription: fetch current mill state → extract drawn number
- [ ] Auto-stamp: when `automatic === true` and drawn number matches a card number, call `stamp(num)`
- [ ] Fix `drawnNumbers.reverse()` in template:
  ```typescript
  // Add getter in component:
  get reversedNumbers(): number[] { return [...this.drawnNumbers].reverse(); }
  // Use in template: *ngFor="let num of reversedNumbers"
  ```
- [ ] Wire `callBingo()` → show winner banner when server returns `true`
- [ ] Unsubscribe from polling in `ngOnDestroy`

---

### ✅ Step 8 — CDK Dialog & Fix BingoStartComponent

- [ ] Install: `ng add @angular/cdk`
- [ ] Create `src/app/shared/username-dialog/username-dialog.component.ts` (see §9)
- [ ] Rewrite `participate()` in `BingoStartComponent` to use CDK `Dialog` (see §9)
- [ ] Fix deprecated `.subscribe(success, error)` → use `.subscribe({ next: ..., error: ... })`
- [ ] Standardise `localStorage` key to `'userId'` everywhere (currently `'userid'` in start, `'id'` in setting)
- [ ] Delete `bingo-window/` folder

---

### ✅ Step 9 — Complete BingoSettingComponent

- [ ] Fix `localStorage.getItem('id')` → `localStorage.getItem('userId')`
- [ ] Remove `window.location.reload()` — emit a state update via a shared service or Angular signals instead
- [ ] Apply background colour reactively using `HostBinding` or a CSS custom property instead of direct DOM manipulation

---

### ✅ Step 10 — Cleanup & Tests

- [ ] Move `mock-bingo-card.ts` to `src/testing/`
- [ ] Remove the mock fallback from production `BingoCardService.create()` — errors should propagate properly
- [ ] Update all `*.spec.ts`:
  - Use `provideHttpClientTesting()` instead of `HttpClientTestingModule`
  - Use standalone `TestBed.configureTestingModule` with `imports: [ComponentUnderTest]`
- [ ] Each service: add one happy-path test + one error-path test
- [ ] Run `ng test` — all tests green
- [ ] Run `ng build --configuration production` — zero errors

---

## 11. Known Bugs to Fix

| File                          | Bug                                                                                    | Fix                                                |
|-------------------------------|----------------------------------------------------------------------------------------|----------------------------------------------------|
| `bingo-setting.component.ts`  | `localStorage.getItem('id')` — wrong key                                              | Change to `'userId'`                               |
| `bingo-start.component.ts`    | `localStorage.setItem('userid', ...)` — wrong key                                     | Change to `'userId'`                               |
| `bingo-card.component.html`   | `drawnNumbers.reverse()` mutates the array on every change detection cycle            | Use a `reversedNumbers` getter with a spread copy  |
| `bingo-mill.component.ts`     | `BingoMillService` is never injected — mill state is never persisted to the server    | Inject service, call `open()` on init              |
| `bingo-card.component.ts`     | Card is never loaded from server on `ngOnInit`                                        | Call `BingoCardService.get()` on init              |
| `bingo-start.component.ts`    | `.subscribe(success, error)` two-argument form is deprecated in RxJS 7+              | Use `.subscribe({ next, error })` object form      |
| `bingo.service.ts`            | Base URL is hard-coded as `'http://localhost:8080/api'`                               | Read from `environment.apiUrl`                     |
| `bingo-ball.component.ts`     | Contains draw logic that belongs in the parent component                              | Move to parent, make ball display-only             |

---

## 12. BingoServer Contract (written by BingoClient)

> This section will serve as the requirements document for BingoServer.

### Endpoints to implement

All endpoints from §4 — copy that table into the BingoServer design document.

### Auth endpoint (new — does not exist yet)

```
POST /api/auth/login
Request:  { "username": "string", "password": "string" }
Response: { "token": "JWT string", "userId": "UUID string" }
```

The JWT should contain at minimum: `userId`, `username`, issued-at, expiry.

### BingoMill — additional fields needed

The client requires the following extra fields on the `BingoMill` response
that are not present in the current interface:

```json
{
  "id": "UUID",
  "minimumNumber": 1,
  "maximumNumber": 75,
  "cardType": "default",
  "lastDrawnNumber": 42,
  "drawnNumbers": [5, 12, 42],
  "participantsCount": 8,
  "winner1": "Alice",
  "winner2": null,
  "winner3": null,
  "winnerFull": null
}
```

### BingoAndroid

BingoAndroid will be a player-only client. It will use the same endpoints as BingoClient's player persona:
- `POST /auth/login`
- `GET/POST /bingoCard`
- `GET /bingoMill/:id` (polling for drawn numbers)

The interface definitions in §3 will serve as the shared DTO contract across all three projects.

---

*End of PLAN.md*

