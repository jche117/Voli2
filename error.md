## Error & Troubleshooting Log

*(Chronological; newest lower in each date group)*

### Environment & Tooling
*   **Root Cause**: The `poetry run alembic` commands were being executed from the project's root directory (`Voli/`). Poetry commands must be run from within the directory containing the `pyproject.toml` file, which is `packages/backend/` for the backend service.
*   **Resolution**: The correct procedure was established: first, navigate into the backend directory (`cd packages/backend`), then run the required `poetry` commands.

### 4. Project Structure: Duplicate Schema File

*   **Issue**: A file named `schemas.py` was found in the project root (`c:\Users\jiazh\Voli\schemas.py`), which was an exact duplicate of the user schemas file within the backend module.
*   **Resolution**: To prevent confusion and maintain a clean project structure, the duplicate file in the root directory was deleted.

### 5. Configuration: Incorrect API Port

*   **Issue**: The frontend (`.env.local`) was configured to make API calls to a port that did not always match the port the backend was exposed on (e.g., frontend pointing to `8000` while backend was on `8001`).
*   **Resolution**: The `NEXT_PUBLIC_API_URL` in `packages/web/.env.local` was corrected to point to the correct backend port (`http://localhost:8001/api/v1`), and the frontend server was restarted to apply the change.

---

## August 13, 2025

### 1. Admin Page Redirect Loop
*   **Error**: Clicking the "administrator" role link in the header would navigate to `/admin` and then immediately redirect back to the main dashboard.
*   **Root Cause**: The `AdminPage` component was still using an old authorization check based on a `is_admin: true` boolean flag inside the JWT. The authentication system had been upgraded to use a `roles: ['administrator']` array, so the check was failing, causing the page to redirect unauthorized users.
*   **Resolution**: The `useEffect` hook in `packages/web/app/admin/page.tsx` was updated to decode the JWT and check if the `roles` array includes `'administrator'` instead of checking for the obsolete `is_admin` flag.

### 2. Admin User Table - 404 Not Found
*   **Error**: The user table on the `/admin` page failed to load, showing a `GET http://localhost:8001/api/v1/admin/users/ 404 (Not Found)` error in the console.
*   **Root Cause**: The frontend `UserTable.tsx` component was making an API call to an incorrect endpoint. The user-fetching endpoint had been moved from `/admin/users/` to `/users/`.
*   **Resolution**: The `api.get()` call in `UserTable.tsx` was changed from `/admin/users/` to `/users/` to match the correct backend route.

### 3. Admin User Table - 405 Method Not Allowed
*   **Error**: After fixing the 404, the user table still failed to load, this time with a `405 Method Not Allowed` error.
*   **Root Cause**: The backend endpoint for fetching users (`/users/`) was protected by a permission check (`get_current_admin_user`) that was still using the old `is_admin` boolean logic. The new `RoleChecker` was not being used.
*   **Resolution**: The `read_users` function in `packages/backend/app/modules/users/router.py` was updated. The dependency `Depends(get_current_admin_user)` was replaced with `Depends(security.RoleChecker(["administrator"]))` to use the correct role-based authorization.

### 4. Admin User Table - 500 Internal Server Error & CORS Error
*   **Error**: After fixing the authorization, the API responded with a `500 Internal Server Error`, which manifested as a CORS error in the browser.
*   **Root Cause**: The backend was failing to serialize the `User` objects into JSON. The Pydantic schema for the user (`packages/backend/app/modules/users/schemas.py`) was out of sync with the SQLAlchemy model. It still contained fields like `is_admin` and `role_id` instead of the new `roles` relationship.
*   **Resolution**: The `UserInDBBase` and `User` Pydantic schemas were updated to remove the old fields and correctly represent the `roles` relationship, allowing the user data to be serialized and sent to the frontend successfully.

## August 14, 2025

### 1. Users Endpoint 500 (ResponseValidationError: is_active bool)
* **Error**: `ResponseValidationError` complaining `Input should be a valid boolean` for `is_active` in multiple user objects.
* **Root Cause**: Database instances missing `is_active` column or containing NULL after model re-introduction; Pydantic schema required non-null bool leading to validation failure.
* **Resolution**: Added migrations `a1b2c3d4e5f6` (ensure column) & `b7c9d2e1f234` (backfill + enforce NOT NULL/default). Introduced temporary runtime patch in users list to coerce NULL -> True (removal planned post rollout).

### 2. Roles Modal TypeError (Frontend)
* **Error**: `TypeError: Cannot read properties of undefined (reading 'map')` in `UserTable.tsx` referencing `allRoles.map`.
* **Root Cause**: `getRoles` helper already returned the roles array, but component accessed `rolesResponse.data`, resulting in `undefined` & missing guards.
* **Resolution**: Corrected usage to treat return as array & added `(allRoles || [])` and `(user.roles || [])` safeguards.

### 3. Baseline Role Missing in Tests
* **Error**: Role seeding test failed expecting `'user'` role.
* **Root Cause**: Startup sequence previously only guaranteed `administrator` presence in some paths; `user` not created before assertions.
* **Resolution**: Implemented lifespan-based seeding for both roles & auto-assignment of baseline `user` during registration.

### 4. Attempt to Revoke Baseline 'user' Role
* **Issue**: Revoking baseline role would break assumptions about minimum permissions.
* **Resolution**: Service layer treats revocation of `'user'` as no-op (future explicit 400 + audit log planned).

### 5. Pydantic Deprecation Warnings
* **Issue**: Usage of legacy `.dict()` and Config classes produced V2 warnings.
* **Resolution**: Replaced major `.dict()` usages with `.model_dump()`; remaining: migrate Config -> ConfigDict.

### 6. Bcrypt __about__ Attribute Warning
* **Issue**: `AttributeError: module 'bcrypt' has no attribute '__about__'` surfaced from passlib compatibility edge.
* **Resolution**: Non-blocking; slated for dependency pin/upgrade review.
