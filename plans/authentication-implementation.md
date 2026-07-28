# Authentication Implementation Plan — PasswordVaultApi

**Provenance**: Synthesized from 4 parallel adversarial analyses (architecture-critic, security-analyst, portfolio-optimizer, implementation-pragmatist) + codebase exploration.

**Recommendation**: Custom JWT Authentication

**Estimated effort**: 10-14 hours across 6 phases

---

## Architecture Constraints

1. **Must NOT require EF Core** — sqlite-net-pcl is the database layer
2. Must follow existing patterns: primary constructors, interface-based DI, repository/service layers
3. DatabaseInitializer uses `conn.CreateTableAsync<T>()` for schema management
4. Must maintain stateless API pattern
5. PasswordEntry must belong to a User (UserId FK)

## Why Custom JWT (Rejected Alternatives)

| Option | Rejection Reason |
|--------|-----------------|
| ASP.NET Identity | Forces EF Core migration — incompatible with sqlite-net-pcl |
| Keycloak/OIDC | Overkill for portfolio MVP, adds external infrastructure dependency |
| Session-based | Violates stateless API pattern, less modern, fewer interview talking points |

## Existing Codebase Patterns

- Primary constructors: `class Foo(IBar bar)`
- Interface-based DI: `IPasswordEntryRepository`, `IPasswordEntryService`
- SQLiteAsyncConnection injected as singleton
- Repository pattern for data access, Service pattern for business logic
- Thin controllers that delegate to services
- `DatabaseInitializer.CreateTableAsync<T>()` for schema

---

## Phase 1 — Domain Layer: User & RefreshToken Entities

**Parallelizable: YES (all 3 tasks independent)**

| Task | Files | What | Verification |
|------|-------|------|-------------|
| 1.1 User entity | `Domain/User.cs` | Entity with Id, Email, Username, PasswordHash, CreatedAt. Factory method pattern matching PasswordEntry. Private ctor, validation. | Compiles. Follows PasswordEntry pattern. |
| 1.2 RefreshToken entity | `Domain/RefreshToken.cs` | Entity with Id, Token, UserId, Expires, Revoked. Factory method. | Compiles. |
| 1.3 Repository interfaces | `Domain/Interfaces/IUserRepository.cs`, `Domain/Interfaces/IRefreshTokenRepository.cs` | FindByEmail, FindByUsername, Save, FindByToken, SaveRefreshToken, RevokeRefreshToken | Compiles. Interface-only, no deps. |

---

## Phase 2 — Infrastructure Layer: SQLite Entities & Repositories

**Parallelizable: YES (all tasks independent, depend on Phase 1)**

| Task | Files | What | Verification |
|------|-------|------|-------------|
| 2.1 User SQLite entity | `Infrastructure/UserEntity.cs` | [PrimaryKey, AutoIncrement] Id, Email, Username, PasswordHash, CreatedAt. Follows PasswordEntryEntity pattern. | Compiles. |
| 2.2 RefreshToken SQLite entity | `Infrastructure/RefreshTokenEntity.cs` | Id, Token, UserId, Expires, Revoked. | Compiles. |
| 2.3 UserRepository | `Infrastructure/UserRepository.cs` | Implements IUserRepository with SQLiteAsyncConnection. FindByEmail, FindByUsername, Save. | Compiles. Follows PasswordEntryRepository pattern. |
| 2.4 RefreshTokenRepository | `Infrastructure/RefreshTokenRepository.cs` | Implements IRefreshTokenRepository. Save, FindByToken, RevokeAllForUser. | Compiles. |
| 2.5 Update DatabaseInitializer | `Infrastructure/DatabaseInitializer.cs` | Add `CreateTableAsync<UserEntity>()` and `CreateTableAsync<RefreshTokenEntity>()`. | Run app — tables created in SQLite. |

---

## Phase 3 — Application Layer: Auth Service & Password Hashing

**Parallelizable: 3.1 and 3.2 independent; 3.3 depends on 3.1+3.2; 3.4 independent**

| Task | Files | What | Verification |
|------|-------|------|-------------|
| 3.1 NuGet packages | `Api/Api.csproj`, `Application/Application.csproj` | Add `BCrypt.Net-Next` to Application, `System.IdentityModel.Tokens.Jwt` + `Microsoft.AspNetCore.Authentication.JwtBearer` to Api | `dotnet restore` succeeds |
| 3.2 DTOs | `Application/ViewModels/Write/LoginRequest.cs`, `RegisterRequest.cs`, `Application/ViewModels/Read/AuthResponse.cs` | Email, Username, Password fields. AuthResponse: AccessToken, RefreshToken. | Compiles. |
| 3.3 AuthService | `Application/IAuthService.cs`, `Application/AuthService.cs` | Register (BCrypt hash password, save user), Login (verify BCrypt hash, generate JWT), Refresh (validate refresh token, rotate). Follows IPasswordEntryService pattern. | Unit test: Register returns AuthResponse. Login with wrong password returns null. |
| 3.4 Modify PasswordEntryService | `Application/IPasswordEntryService.cs`, `Application/PasswordEntryService.cs` | Add userId parameter to all methods. Filter by UserId in queries. Update DTOs to include UserId. | Compiles. Queries filter by user. |

---

## Phase 4 — Api Layer: Auth Controller, JWT Middleware, Program.cs

**Sequential: 4.1 → 4.2 → 4.3 → 4.4**

| Task | Files | What | Verification |
|------|-------|------|-------------|
| 4.1 AuthController | `Api/AuthController.cs` | POST /api/auth/register, POST /api/auth/login, POST /api/auth/refresh, POST /api/auth/logout. Thin controller delegating to IAuthService. Follows PasswordController pattern. | Swagger shows endpoints. curl register → 201, login → 200 with token. |
| 4.2 JWT configuration | `Api/appsettings.json` | Add JwtSettings section: Key, Issuer, Audience, AccessTokenExpiry (15min), RefreshTokenExpiry (7 days). | Config loads. |
| 4.3 Program.cs | `Api/Program.cs` | Register AuthService, JWT Bearer auth middleware, [Authorize] default, rate limiting on auth endpoints, tighten CORS. Add UseAuthentication() + UseAuthorization() before MapControllers. | `dotnet run` — unauthenticated GET /api/password returns 401. Authenticated GET returns 200. |
| 4.4 Modify PasswordController | `Api/PasswordController.cs` | Add [Authorize] attribute. Extract UserId from HttpContext.User claims. Pass to service methods. | Unauthenticated requests blocked. Authenticated requests work. |

---

## Phase 5 — Frontend: Auth State, Login/Register, Token Management

**5.1 and 5.2 parallel; 5.3-5.5 depend on both; 5.6 depends on all**

| Task | Files | What | Verification |
|------|-------|------|-------------|
| 5.1 Auth service | `src/services/auth-service.ts` | fetch calls: register, login, logout, refreshToken. Return tokens. Handle errors. Follows password-entry-service.ts pattern. | Compiles. Types correct. |
| 5.2 Auth context | `src/contexts/AuthContext.tsx` | React context: user state, token state, login/register/logout functions. Store accessToken in memory (NOT localStorage for security). | Compiles. |
| 5.3 Wire up SignInModal | `src/components/SignInModal.tsx` | Connect email/password fields to AuthContext.login(). Add form submission, loading state, error display. Add link to RegisterModal. | Clicking Sign In triggers login API call. |
| 5.4 RegisterModal | `src/components/RegisterModal.tsx` | New modal: email, username, password, confirm password. Calls AuthContext.register(). | Clicking Register triggers register API call. |
| 5.5 API interceptor | `src/services/password-entry-service.ts` | Add Authorization: Bearer header to all fetch calls. On 401, attempt token refresh, retry request. | API calls include token. Expired token triggers refresh. |
| 5.6 App.tsx auth guard | `src/App.tsx` | Wrap with AuthProvider. If not authenticated, show SignInModal (always open, no close). If authenticated, show normal app. | Unauthenticated → shows login. Authenticated → shows password entries. |

---

## Phase 6 — Security Hardening & Polish

**Sequential tasks**

| Task | Files | What | Verification |
|------|-------|------|-------------|
| 6.1 CORS hardening | `Api/Program.cs` | Replace AllowAnyOrigin with specific origin (localhost:5173). | Cross-origin requests from frontend work. |
| 6.2 Rate limiting | `Api/Program.cs` | Add rate limiting middleware on /api/auth/* endpoints (5 attempts per minute). | 6th login attempt returns 429. |
| 6.3 i18n keys | `src/i18n/` | Add translation keys for auth UI (login, register, error messages). | No missing translation warnings. |
| 6.4 End-to-end verification | — | Register → Login → Create entry → Refresh token → Logout → Verify 401. | Complete user journey works. |

---

## Parallelization Map

```
Phase 1 (3 tasks parallel)
    │
    ├── Phase 2 (5 tasks parallel)
    │       │
    │       ├── Phase 3 (3 tasks: 3.1+3.2 parallel → 3.3; 3.4 parallel)
    │       │       │
    │       │       └── Phase 4 (4 tasks sequential)
    │       │               │
    │       │               └── Phase 5 (6 tasks: 5.1+5.2 parallel → 5.3-5.5 → 5.6)
    │       │                       │
    │       │                       └── Phase 6 (4 tasks sequential)
    │       │
    │       └── (3.4 runs parallel with 3.1-3.3)
    │
    └── (2.5 depends on 2.1-2.4)
```

---

## Atomic Commit Strategy

| Commit | Phase | Description |
|--------|-------|-------------|
| 1 | Phase 1 | `feat(domain): add User and RefreshToken entities with repository interfaces` |
| 2 | Phase 2 | `feat(infrastructure): add SQLite entities, repositories, and update DatabaseInitializer` |
| 3 | Phase 3 | `feat(application): add AuthService with BCrypt hashing and JWT generation` |
| 4 | Phase 4 | `feat(api): add AuthController, JWT middleware, and protect PasswordController` |
| 5 | Phase 5 | `feat(frontend): add auth context, login/register modals, and token management` |
| 6 | Phase 6 | `fix(security): harden CORS, add rate limiting, and complete i18n` |

---

## Security Requirements (Password Vault is Sensitive)

1. BCrypt password hashing (NOT the current AES approach for user passwords)
2. Short-lived JWT access tokens (15 min) + refresh tokens (7 days)
3. Refresh tokens stored in HttpOnly cookies
4. Rate limiting on login/register endpoints (5 per minute)
5. Fix existing issues: ECB mode, hardcoded key, wide-open CORS
6. Token validation: issuer, audience, expiration checks
7. Account enumeration prevention: generic error messages for login failures

---

## Database Schema (After Implementation)

```sql
-- New tables
CREATE TABLE User (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Email TEXT NOT NULL UNIQUE,
    Username TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE RefreshToken (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Token TEXT NOT NULL UNIQUE,
    UserId INTEGER NOT NULL,
    Expires TEXT NOT NULL,
    Revoked INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES User(Id)
);

-- Modified table
ALTER TABLE PasswordEntry ADD COLUMN UserId INTEGER;
-- Note: sqlite-net-pcl doesn't support ALTER TABLE ADD COLUMN well.
-- May need to recreate table or handle migration manually.
```
