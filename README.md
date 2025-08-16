# Voli - Volunteer Management SaaS Platform

*Last Updated: August 15, 2025*

## Project Overview

Voli is a web-based SaaS platform designed to streamline volunteer management processes for small-sized volunteer organizations. It aims to provide a comprehensive solution for volunteer onboarding, task assignment, asset tracking, and training management.

## Feature Status

-   **Volunteer Onboarding:** Efficiently manage the process of bringing new volunteers into the organization, including profile creation and data collection.
-   **Detailed Registration:** A comprehensive registration form captures all necessary contact details upfront, streamlining the onboarding process.
-   **Task Management:** Create, assign, and track tasks for volunteers (backend CRUD + basic UI complete; advanced dashboard & filtering pending).
-   **Dynamic Task Management:** A powerful, template-based system allows administrators to define custom forms and fields for different types of tasks, making the platform highly adaptable to various industries.
-   **Asset Management:** Keep a record of physical assets (e.g., equipment, uniforms) assigned to volunteers.
-   **Training Management:** Facilitate the delivery of training materials and track volunteer progress through various training modules.
-   **User Profile Display:** Logged-in users can view their own detailed contact information in a profile modal.
-   **Collapsible Sidebar Navigation:** The dashboard features a collapsible sidebar for intuitive navigation between modules.
-   **Multi-tenancy (Planned):** Architecture will support isolating organization data (not yet implemented).
-   **Admin Dashboard:** A dedicated interface for administrators to manage users, including viewing, deleting, and assigning roles.
    **(No change placeholder to confirm patch state)**

## Technology Stack

Voli is built with a modern, industry-standard technology stack to ensure scalability, performance, and a rich user experience across multiple platforms.

-   **Backend:**
    -   **Language:** Python
    -   **Framework:** FastAPI (for building high-performance APIs)
    -   **Database:** PostgreSQL (a robust, open-source relational database)
    -   **ORM:** SQLAlchemy (Python SQL toolkit and Object Relational Mapper)
    -   **Authentication:** JWT (JSON Web Tokens) for secure API access.
    -   **Dependency Management:** Poetry
    -   **Migrations:** Alembic

-   **Frontend (Web Application):**
    -   **Framework:** Next.js (a React framework for building server-rendered and static web applications)
    -   **Language:** TypeScript (for type safety and improved developer experience)
    -   **Styling:** Tailwind CSS (a utility-first CSS framework for rapid UI development)
    -   **API Client:** Axios

-   **Mobile Applications (iOS & Android):**
    -   **Framework:** React Native (for cross-platform mobile development from a single codebase)

## Environment Variables

Backend `.env` (see `packages/backend/.env`):
- `DATABASE_URL` (e.g. postgresql://user:password@localhost:5432/db)
- `SECRET_KEY` (JWT signing secret)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (optional, default 30)
- Email (optional): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAILS_FROM_EMAIL`
- `LOGIN_URL` (used in welcome email)

Frontend `.env.local`:
- `NEXT_PUBLIC_API_URL` (e.g. http://localhost:8001/api/v1)

## Architecture

### Project Structure

The project adopts a monorepo architecture, managing the backend, web application, and mobile application within a single repository. This approach facilitates code sharing, simplifies dependency management, and streamlines development workflows.

```
voli/
├── packages/
│   ├── backend/      # Python FastAPI backend
│   ├── web/          # Next.js web application
│   └── mobile/       # React Native mobile application
├── pnpm-workspace.yaml
└── package.json      # Root package.json for monorepo scripts
└── README.md
└── completed.md
└── todo.md
```

### Backend Folder Structure

The backend (`packages/backend/app`) now follows a modular architecture to enhance scalability and maintainability. Key components are organized into self-contained modules, making it easier to develop, understand, and extend features.

### Task Templating System

To support a wide variety of volunteer operations, Voli includes a dynamic task templating system. This allows administrators to create and configure different types of tasks to capture industry-specific information.

- **Task Templates:** Admins can define templates (e.g., "Search and Rescue Mission," "Donation Pickup") and build custom forms for each one using a form builder in the admin panel.
- **Dynamic Fields:** The structure of these custom forms is stored as a JSON schema, allowing for flexible fields (text, dates, dropdowns, etc.), including configurable options for `select` (dropdown) fields.
- **Custom Data:** The data for these custom fields is stored in a flexible JSON column in the `tasks` table, ensuring that the core database schema remains clean and stable while providing maximum adaptability.



## Getting Started

Follow these instructions to set up and run the Voli project locally.

### Prerequisites

Ensure you have the following software installed on your system:

-   **Node.js** (LTS version recommended)
-   **pnpm** (Package manager for the monorepo. Install globally: `npm install -g pnpm`)
-   **Python** (3.9+ recommended)
-   **Poetry** (Python dependency manager. Install globally: `pip install poetry`)
-   **Docker Desktop** (for running PostgreSQL in a container, recommended for easy setup)
-   **jwt-decode** (for frontend JWT decoding. Installed via pnpm)
-   **PostgreSQL** (if not using Docker, ensure a local instance is running)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Voli
```

### 2. Install Dependencies

Navigate to the root of the project and install all monorepo dependencies:

```bash
pnpm install
```

Then, install Python dependencies for the backend:

```bash
cd packages/backend
python -m poetry install
```

### 3. Database Setup (PostgreSQL)

Voli requires a PostgreSQL database. You can run it directly on your machine or use Docker.

#### Option A: Run PostgreSQL with Docker (Recommended)

Ensure Docker Desktop is running. Then, execute the following command in your terminal to start the PostgreSQL container defined in `docker-compose.yml`:

```bash
docker compose up -d db
```

This command will:
-   Start the PostgreSQL service defined in `docker-compose.yml`.
-   Map the container's port `5432` to your host machine's port `5432`.
-   Run the container in detached mode (`-d`).

#### Option B: Run Local PostgreSQL Instance

If you have PostgreSQL installed locally, ensure your server is running and accessible on `localhost:5432` with a database named `db` and a user `user` with password `password`. If your credentials differ, update the `DATABASE_URL` in `packages/backend/app/core/config.py` accordingly.

#### Database Migrations

This project uses Alembic to manage database migrations.

##### Generating Migrations

When you make changes to the SQLAlchemy models in `packages/backend/app/db/models.py`, you'll need to generate a new migration script. To do this, run the following command from the `packages/backend` directory:

```bash
poetry run alembic revision --autogenerate -m "A descriptive message about your changes"
```

This will generate a new migration script in `packages/backend/alembic/versions/`.

##### Applying Migrations

To apply the latest migrations to your database, run the following command from the `packages/backend` directory:

```bash
poetry run alembic upgrade head
```

This will update your database schema to match the latest version of your models.

### 4. Running the Application

#### Start Backend Server

Open a new terminal, navigate to the project root (`cd Voli`), and run:

```bash
pnpm --filter backend dev
```

The backend will typically run on `http://localhost:8001`.

#### Start Web Application

Open another new terminal, navigate to the project root (`cd Voli`), and run:

```bash
pnpm --filter web dev
```

The web application will typically run on `http://localhost:3000` (or an available port like `3001`, `3002`, etc., if 3000 is in use).

#### Run Both Concurrently

From the project root (`cd Voli`), you can run both services simultaneously:

```bash
pnpm dev
```

### Project Structure

-   `packages/backend/`: Contains the Python FastAPI backend application.
-   `packages/web/`: Contains the Next.js web application.
-   `packages/mobile/`: Contains the React Native mobile application.
-   `pnpm-workspace.yaml`: Defines the monorepo's workspaces.
-   `package.json`: Root package for monorepo scripts and shared dependencies.

## API Overview

| Domain | Endpoint (prefix /api/v1) | Method | Auth | Description |
|--------|---------------------------|--------|------|-------------|
| Auth | `/token` | POST | Basic (form) | Obtain JWT access token |
| Users | `/users/` | POST | Public | Register new user (with contact) |
| Users | `/users/me` | GET | Bearer | Current user profile |
| Users | `/users/me/contact` | GET | Bearer | Current user contact details |
| Users | `/users/` | GET | Bearer + Role(administrator) | List all users |
| Roles | `/roles/` | GET | Bearer + Role(administrator) | List available roles |
| Roles | `/roles/` | POST | Bearer + Role(administrator) | Create role |
| Roles | `/roles/users/{user_id}/assign/{role_id}` | POST | Bearer + Role(administrator) | Assign role to user |
| Roles | `/roles/users/{user_id}/revoke/{role_id}` | DELETE | Bearer + Role(administrator) | Revoke role from user |
| Note  | *(roles)* | *N/A* | *N/A* | Baseline `user` role cannot be revoked (no-op) |
| Tasks | `/tasks/` | POST | Bearer | Create task (current user owner) |
| Tasks | `/tasks/` | GET | Bearer | List current user's tasks |
| Tasks | `/tasks/all` | GET | Bearer + Role(administrator) | List all tasks |
| Tasks | `/tasks/{id}` | GET | Bearer | Get task (owner or admin) |
| Tasks | `/tasks/{id}` | PUT | Bearer | Update task (owner or admin) |
| Tasks | `/tasks/{id}` | DELETE | Bearer | Delete task (owner or admin) |

Planned: Assets, Reports, Learning, Training modules.

### Role Management Behavior
- Baseline roles are seeded at startup via FastAPI lifespan.
- New users automatically receive the baseline `user` role.
- Revoking the `user` role is ignored (future: explicit 400 response).
- Administrator capabilities derive solely from having the `administrator` role.

### Recent Migrations (RBAC & Stability)
- `f1d2d2f924ab`: Remove legacy `is_admin` column; migrate existing admins to `administrator` role.
- `a1b2c3d4e5f6`: Ensure `is_active` column exists on users.
- `b7c9d2e1f234`: Backfill NULL `is_active`, enforce NOT NULL + default TRUE.

### Testing Additions
- Added tests for role lifecycle, baseline role seeding, and protection against revoking baseline role.

## Troubleshooting

-   **`alembic` is not recognized**: Ensure you are running `alembic` via `poetry run` (e.g., `poetry run alembic ...`) from within the `packages/backend` directory.
-   **`Connection refused` (PostgreSQL)**: Your PostgreSQL server is not running or is not accessible. Ensure Docker Desktop is running and the `db` container is up (`docker compose up -d db`).
-   **CORS Error (`Access-Control-Allow-Origin` header missing)**: This means your frontend is trying to access your backend from a different origin, and the backend is not configured to allow it. Ensure your backend (`packages/backend/main.py`) has the `CORSMiddleware` configured correctly to allow requests from your frontend's URL (e.g., `http://localhost:3002`).
// Removed outdated TokenData password note (no longer applicable after schema refactor).
-   **`AttributeError: module 'bcrypt' has no attribute '__about__'`**: This is a known issue with `passlib` and `bcrypt` versions. It usually doesn't prevent the API from working but can be resolved by ensuring compatible versions or reinstalling `passlib` and `bcrypt` within your Poetry environment.
-   **Profile modal is empty or shows an error**: This likely means the logged-in user does not have an associated record in the `contacts` table. The registration process now handles this automatically for new users. For existing users, a manual entry in the `contacts` table may be required.


## Contributing

See `CONTRIBUTING.md` for workflow, branching, and commit conventions.

## License

MIT License. See `LICENSE`.

## Roadmap (Short-Term)
- Multi-tenancy data partition strategy (tenant_id vs schema per org) – design
- Tests: expand beyond smoke tests (users, roles, tasks)
- Asset & Training modules initial schemas
- Frontend task dashboard enhancements (filters, status boards)
- CI pipeline (lint, pytest, build) via GitHub Actions

---
For historical changes see `completed.md` & `error.md`.
