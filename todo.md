# Voli Project - To-Do List

*Last Updated: August 14, 2025 (RBAC & role seeding updates applied)*

This document outlines the remaining major tasks for the Voli SaaS platform.

## 1. Database & Backend
- [x] Ensure PostgreSQL database is running and accessible (local installation or Docker container).
- [x] Apply initial database migrations: `cd packages/backend && poetry run alembic upgrade head`.
- [x] Refine database models as needed for new features. (Task and Contact models updated)
- [ ] Implement remaining core API endpoints for:
    - [ ] Volunteer Onboarding (extended profile workflows & approvals)
    - [x] Task Management (CRUD complete; advanced filters, status boards pending)
    - [ ] Asset Management (tracking & assignment) (models scaffolded; services partially refactored)
    - [ ] Training Management (courses & progress tracking)
- [x] Implement authentication middleware for admin API routes.
- [x] Replace legacy is_admin flag with full RBAC (roles table + user_roles association).
- [x] Add migrations: remove is_admin (f1d2d2f924ab), ensure is_active (a1b2c3d4e5f6), backfill & enforce NOT NULL (b7c9d2e1f234).
- [x] Add lifespan-based role seeding (administrator + user baseline) & automatic 'user' role assignment during registration.
- [x] Protect baseline 'user' role from revocation; make assignment idempotent.
# Voli Project - To-Do List

*Last Updated: August 14, 2025 (RBAC & role seeding updates applied)*

This document outlines the remaining major tasks for the Voli SaaS platform.

## 1. Database & Backend
- [x] Ensure PostgreSQL database is running and accessible (local installation or Docker container).
- [x] Apply initial database migrations: `cd packages/backend && poetry run alembic upgrade head`.
- [x] Refine database models as needed for new features. (Task and Contact models updated)
- [ ] Implement remaining core API endpoints for:
    - [ ] Volunteer Onboarding (extended profile workflows & approvals)
    - [x] Task Management (CRUD complete; advanced filters, status boards pending)
    - [x] Asset Management (tracking & assignment)
    - [ ] Training Management (courses & progress tracking)
- [x] Implement authentication middleware for admin API routes.
- [x] Replace legacy is_admin flag with full RBAC (roles table + user_roles association).
- [x] Add migrations: remove is_admin (f1d2d2f924ab), ensure is_active (a1b2c3d4e5f6), backfill & enforce NOT NULL (b7c9d2e1f234).
- [x] Add lifespan-based role seeding (administrator + user baseline) & automatic 'user' role assignment during registration.
- [x] Protect baseline 'user' role from revocation; make assignment idempotent.
- [x] Return explicit 400 on attempts to revoke baseline role (currently silent no-op).
- [ ] Add audit logging for role changes (assign/revoke).
- [ ] Remove runtime safety backfill in users endpoint after confirming all deployments have new migrations.
- [x] Convert Pydantic Config classes to ConfigDict (suppress deprecation warnings).
- [ ] Add hashing & security hardening review (password policy, rate limiting).

## 2. Testing
- [x] Add role lifecycle tests (create/list/assign/revoke).
- [x] Add baseline role protection test.
- [ ] Expand test coverage: assets placeholder, contacts update, negative auth cases, task filtering once implemented.
- [ ] Add migration smoke test (apply to empty DB & existing DB snapshot).

## 3. Web Application (Next.js)
- [x] Implement robust authentication state management using React Context to persist user sessions (`AuthContext` and `withAuth` HOC are now in place).
- [x] Implement protected routes and redirection logic based on authentication status. (`withAuth` HOC implemented for `/admin` and `/dashboard`).
- [ ] Develop comprehensive UI for core features:
    - [x] User Registration form with detailed contact information capture.
    - [ ] Volunteer Onboarding forms and profile management.
    - [x] Basic user profile display (Profile Modal).
    - [x] Basic task create/edit/delete (modal)
    - [ ] Advanced task dashboard (filters, kanban, bulk actions)
    - [x] Asset listing and management interfaces.
    - [ ] Training module display and progress tracking.
- [x] Integrate API calls for login, registration, and admin user management.
- [x] Fix roles modal (handle empty / undefined allRoles & correct getRoles return handling).
- [ ] Add optimistic UI updates for role changes.
- [ ] Add diff summary in Manage Roles modal before saving.
- [ ] Accessibility pass (focus trap, ARIA labels) for modals.
- [x] Apply consistent styling and ensure responsiveness using Tailwind CSS. (Started with Login page, Admin page, and forms)
- [x] Implement user-friendly navigation. (Dashboard header with icons implemented).

## 4. Mobile Application (React Native)
- [ ] Set up navigation (React Navigation) for both iOS and Android platforms.
- [ ] Implement authentication flows (login, registration, logout).
- [ ] Develop core UI components for:
    - [ ] Volunteer profiles and onboarding.
    - [ ] Task viewing and updates.
    - [ ] Asset tracking.
    - [ ] Training content consumption.
- [ ] Integrate API calls with the backend for all mobile features.

## 5. General Project Tasks
- [ ] Implement multi-tenancy logic to ensure data isolation between organizations.
- [x] Add comprehensive error handling and logging across all layers (backend, web, mobile). (Improved for login/register forms)
- [ ] Write unit and integration tests for critical components and API endpoints (in progress; expand breadth).
- [ ] Set up Continuous Integration/Continuous Deployment (CI/CD) pipelines (include lint, pytest, build, type-check).
- [ ] Define and implement a deployment strategy for the entire platform.
- [ ] Create detailed documentation for:
    - [ ] API endpoints.
    - [ ] Project setup and development environment.
    - [ ] Usage guides for end-users.

## 6. Future Enhancements (Post-MVP)
- [ ] Real-time updates using WebSockets.
- [ ] Notifications system.
- [ ] Reporting and analytics dashboards.
- [ ] Integration with third-party services.
- [ ] WebSockets for task & role change push updates.
- [ ] Fine-grained permissions (per-module, per-tenant) layered on roles.
- [ ] Add audit logging for role changes (assign/revoke).
- [ ] Remove runtime safety backfill in users endpoint after confirming all deployments have new migrations.
- [ ] Convert Pydantic Config classes to ConfigDict (suppress deprecation warnings).
- [ ] Add hashing & security hardening review (password policy, rate limiting).

## 2. Testing
- [x] Add role lifecycle tests (create/list/assign/revoke).
- [x] Add baseline role protection test.
- [ ] Expand test coverage: assets placeholder, contacts update, negative auth cases, task filtering once implemented.
- [ ] Add migration smoke test (apply to empty DB & existing DB snapshot).

## 3. Web Application (Next.js)
- [x] Implement robust authentication state management using React Context to persist user sessions (`AuthContext` and `withAuth` HOC are now in place).
- [x] Implement protected routes and redirection logic based on authentication status. (`withAuth` HOC implemented for `/admin` and `/dashboard`).
- [ ] Develop comprehensive UI for core features:
    - [x] User Registration form with detailed contact information capture.
    - [ ] Volunteer Onboarding forms and profile management.
    - [x] Basic user profile display (Profile Modal).
    - [x] Basic task create/edit/delete (modal)
    - [ ] Advanced task dashboard (filters, kanban, bulk actions)
    - [ ] Asset listing and management interfaces (waiting on backend completion).
    - [ ] Training module display and progress tracking.
- [x] Integrate API calls for login, registration, and admin user management.
- [x] Fix roles modal (handle empty / undefined allRoles & correct getRoles return handling).
- [ ] Add optimistic UI updates for role changes.
- [ ] Add diff summary in Manage Roles modal before saving.
- [ ] Accessibility pass (focus trap, ARIA labels) for modals.
- [x] Apply consistent styling and ensure responsiveness using Tailwind CSS. (Started with Login page, Admin page, and forms)
- [x] Implement user-friendly navigation. (Dashboard header with icons implemented).

## 4. Mobile Application (React Native)
- [ ] Set up navigation (React Navigation) for both iOS and Android platforms.
- [ ] Implement authentication flows (login, registration, logout).
- [ ] Develop core UI components for:
    - [ ] Volunteer profiles and onboarding.
    - [ ] Task viewing and updates.
    - [ ] Asset tracking.
    - [ ] Training content consumption.
- [ ] Integrate API calls with the backend for all mobile features.

## 5. General Project Tasks
- [ ] Implement multi-tenancy logic to ensure data isolation between organizations.
- [x] Add comprehensive error handling and logging across all layers (backend, web, mobile). (Improved for login/register forms)
- [ ] Write unit and integration tests for critical components and API endpoints (in progress; expand breadth).
- [ ] Set up Continuous Integration/Continuous Deployment (CI/CD) pipelines (include lint, pytest, build, type-check).
- [ ] Define and implement a deployment strategy for the entire platform.
- [ ] Create detailed documentation for:
    - [ ] API endpoints.
    - [ ] Project setup and development environment.
    - [ ] Usage guides for end-users.

## 6. Future Enhancements (Post-MVP)
- [ ] Real-time updates using WebSockets.
- [ ] Notifications system.
- [ ] Reporting and analytics dashboards.
- [ ] Integration with third-party services.
- [ ] WebSockets for task & role change push updates.
- [ ] Fine-grained permissions (per-module, per-tenant) layered on roles.