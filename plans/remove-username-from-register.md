# Remove Username from Register Modal

## Hyperplan Analysis

### Critical Discovery: Two Different "username" Concepts

| Concept | Where | Purpose |
|---------|-------|---------|
| **User.username** | `User.cs`, `AuthContext`, `RegisterModal` | Identity of the logged-in user |
| **PasswordEntry.username** | `PasswordEntry.cs`, `SidePanel`, `PasswordEntryForm` | Username stored WITH a password entry (e.g. "my-gmail-user") |

**The request targets ONLY User.username during registration.** PasswordEntry.username is completely unaffected.

---

## Scope of Changes

### Frontend (3 files)

| File | Change |
|------|--------|
| `RegisterModal.tsx` | Remove username `TextField`, state, validation, and `register()` call arg |
| `auth-service.ts` | Remove `username` from `RegisterRequest` type |
| `en.json` | Remove `registerModal.usernameLabel` and `registerModal.usernameMinLength` |

### Backend (3 files)

| File | Change |
|------|--------|
| `RegisterRequest.cs` | Remove `Username` property |
| `AuthService.cs` | Remove `FindByUsername` uniqueness check; set `Username = registerRequest.Email` |
| `User.cs` | No change needed — username stays required on the entity, just populated with email |

### NOT affected

- Login flow (uses email only)
- JWT tokens (no username claim)
- SidePanel, App.tsx filtering
- PasswordEntry forms

---

## Key Design Decision

**User.username stays in the domain model** — it's just no longer user-provided during registration. The backend sets `Username = registerRequest.Email` directly. The email is already unique, validated, and used as the login identifier, so there's no benefit to extracting a prefix or generating a separate value. `User.Username` could be renamed to `Email` in a future refactor, but that's out of scope here.

---

## Implementation Tasks

| # | Task | Layer | Parallelizable? |
|---|------|-------|-----------------|
| 1 | Remove `Username` from `RegisterRequest.cs` | Backend | — |
| 2 | Update `AuthService.Register` to set `Username = registerRequest.Email` (remove `FindByUsername` check) | Backend | Depends on #1 |
| 3 | Remove username `TextField`, state, validation from `RegisterModal.tsx` | Frontend | Parallel with #1 |
| 4 | Remove `username` from `RegisterRequest` type in `auth-service.ts` | Frontend | Parallel with #1 |
| 5 | Clean up `en.json` (remove `usernameLabel`, `usernameMinLength`) | Frontend | Parallel with #1 |
| 6 | End-to-end test: Register → verify account works | Both | Depends on #2, #3, #4 |

Tasks **#1, #3, #4, #5** can all run in parallel (no interdependencies). Task **#2** depends on #1. Task **#6** is verification.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Email collision (duplicate registration) | Low | Already handled by existing `FindByEmail` check |
| Frontend/backend version mismatch during deploy | Low | Local MVP project |
| `username` referenced elsewhere unexpectedly | Low | Grep confirmed: only `AuthContext.username` reads it; no other feature depends on user-chosen value |
