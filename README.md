# Instagram Reel Downloader — Frontend

React SPA where authenticated users submit Instagram Reel URLs, the backend processes them asynchronously, and the frontend polls for status and provides download links for video, audio, and transcript.

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 (with React Compiler) |
| Bundler / dev server | Vite 8 |
| Routing | TanStack Router v1 |
| Data fetching | TanStack Query v5 |
| Styling | Tailwind CSS v4 (dark theme only) |
| Package manager | pnpm |

## Prerequisites

- **Node.js** >= 22
- **pnpm** (`npm i -g pnpm` if not installed)
- **Backend API** running on port `8000` (required for login, registration, and task processing)

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server
pnpm dev
```

The app will be available at **http://localhost:5173**.

In development, all `/api/*` requests are proxied to `http://localhost:8000` via Vite (the `/api` prefix is stripped before forwarding). This mirrors the production nginx behavior.

## Available Scripts

```bash
pnpm dev        # Start dev server with Hot Module Replacement
pnpm build      # Production build → dist/
pnpm preview    # Preview the production build locally
pnpm lint       # Run ESLint
```

## Project Structure

```
src/
  lib/
    api.js              # fetch wrapper with JWT auth + 401 handling
    auth-sw.js          # registers the service worker for media auth
  hooks/
    use-auth.js         # current user query + login/logout helpers
    use-tasks.js        # task list query with auto-polling
  pages/
    dashboard.jsx       # task list + submit new reel URL
    task-detail.jsx     # status, video/audio player, transcript
    login.jsx
    register.jsx
    settings.jsx        # update profile
  components/
    layouts/
      root-layout.jsx   # global providers and Toaster
      auth-layout.jsx   # guards protected routes
    navbar.jsx
    task-card.jsx       # summary card used in dashboard
    create-task-modal.jsx
    ui/                 # shared primitive components
  router.jsx            # route definitions (TanStack Router)
  main.jsx              # app entry point
  index.css             # Tailwind setup + design tokens (@theme {})
public/
  auth-sw.js            # service worker (intercepts media requests)
  icons.svg             # SVG sprite sheet
```

## How It Works

1. **Register / log in** — create an account or sign in; a JWT is stored in `localStorage`.
2. **Submit a reel** — paste an Instagram Reel URL in the dashboard; this creates a task on the backend.
3. **Polling** — the app polls the backend for status updates until the task finishes.
4. **Download** — once completed, play video or audio inline, view the transcript, or download all files as a zip.

## Routing

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Login form — redirects to `/` if already authenticated |
| `/register` | Public | Registration form — redirects to `/` if already authenticated |
| `/` | Protected | Dashboard: task list and submit new reel |
| `/tasks/:taskId` | Protected | Task detail: status, media player, transcript |
| `/settings` | Protected | User profile settings |

Protected routes redirect to `/login` if no valid session is found.

## API Integration

### Authentication

- Tokens are stored in `localStorage` as `access_token` (JWT).
- Every request includes an `Authorization: Bearer <token>` header.
- A `401` response automatically clears the token and redirects to `/login`.
- **Media auth via Service Worker:** `<video>` and `<audio>` elements cannot set custom headers, so `public/auth-sw.js` intercepts requests to `/api/tasks/:id/(video|audio)` and injects the auth header transparently.

### Endpoints

**Users**

| Method | Path | Description |
|---|---|---|
| `POST` | `/users` | Register a new user |
| `POST` | `/users/login` | Log in (form-data) — returns JWT |
| `GET` | `/users/me` | Get current user profile |
| `PATCH` | `/users/me` | Update current user profile |

**Tasks**

| Method | Path | Description |
|---|---|---|
| `GET` | `/tasks` | List all tasks for the current user |
| `POST` | `/tasks` | Create a task — body: `{ uri: "<reel-url>" }` |
| `GET` | `/tasks/:id` | Get task details and status |
| `POST` | `/tasks/:id/cancel` | Cancel a pending/running task |
| `GET` | `/tasks/:id/video` | Stream the downloaded video |
| `GET` | `/tasks/:id/audio` | Stream the extracted audio |
| `GET` | `/tasks/:id/transcript` | Get the transcript |
| `GET` | `/tasks/:id/files` | Download all files as a zip archive |

### Polling

- Task list (`useTasks`): polls every **5 s** while any task has status `pending` or `running`.
- Task detail (`useTask`): polls every **3 s** while the individual task is active.

## API Proxy

| Environment | Proxy |
|---|---|
| Development | Vite proxies `/api/*` → `http://localhost:8000` (strips `/api` prefix) |
| Production | nginx proxies `/api/` → `http://api:8000/` (strips `/api` prefix) |

## Docker (Production)

The production setup builds the app and serves it via nginx. nginx proxies `/api/*` to the backend, matching the Vite dev proxy behavior.

```bash
# Create the shared Docker network (once)
docker network create instagram-reel-downloader

# Build and start the container
docker compose build
docker compose up -d
```

The app will be available at **http://localhost:3000**.

The Dockerfile uses a two-stage build: `node:22-alpine` compiles the Vite bundle, then `nginx:alpine` serves the static output.

> The backend service must also be attached to the `instagram-reel-downloader` network and reachable under the hostname **`api`** for the API proxy to work.
