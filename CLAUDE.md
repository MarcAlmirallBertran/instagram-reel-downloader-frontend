# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # Production build
pnpm preview    # Preview production build
pnpm lint       # Run ESLint
```

## Architecture

This is a React 19 + Vite 8 SPA for downloading Instagram Reels — authenticated users submit reel URLs, the backend processes them asynchronously, and the frontend polls for status and provides download links.

**Stack:**
- React 19 with the React Compiler enabled (via `babel-plugin-react-compiler` + `@rolldown/plugin-babel`)
- Vite 8 for bundling and dev server
- TanStack Router v1 for client-side routing
- TanStack Query v5 for data fetching, caching, and polling
- Tailwind CSS v4 (`@tailwindcss/vite`) — theme tokens defined in `src/index.css` via `@theme {}`
- `sonner` for toast notifications
- `lucide-react` for icons
- `clsx` for conditional class names

**React Compiler note:** The React Compiler is active, so manual `useMemo`/`useCallback` optimizations are unnecessary. Avoid adding them unless there's a specific reason.

**ESLint:** Uses ESLint 9 flat config (`eslint.config.js`). Covers `.js` and `.jsx` files with `react-hooks` and `react-refresh` plugins. `no-unused-vars` is set to error but ignores variables matching `^[A-Z_]`.

## Project Structure

```
src/
  lib/api.js              # Fetch wrapper + authApi / tasksApi
  hooks/use-auth.js       # useUser, useLogin, useRegister, useLogout, useUpdateUser, isAuthenticated()
  hooks/use-tasks.js      # useTasks, useTask, useCreateTask, useCancelTask, useTranscript
  router.jsx              # TanStack Router route tree
  main.jsx                # Entry point — QueryClientProvider + RouterProvider + Toaster
  index.css               # Tailwind import + @theme tokens (dark-only palette)
  pages/
    dashboard.jsx         # Task list + create task
    task-detail.jsx       # Task status, download links, transcript
    login.jsx
    register.jsx
    settings.jsx
  components/
    layouts/root-layout.jsx    # Root route wrapper
    layouts/auth-layout.jsx    # Protected route wrapper (redirects to /login if unauthenticated)
    navbar.jsx
    task-card.jsx
    create-task-modal.jsx
    ui/                        # Primitive UI components (button, input, card, badge, spinner)
```

## Routing

Routes are defined in `src/router.jsx` using TanStack Router's file-less approach:
- `/login`, `/register` — public, redirect to `/` if already authenticated
- `/` — dashboard (protected)
- `/tasks/$taskId` — task detail (protected)
- `/settings` — settings (protected)

Protected routes sit under an `authLayoutRoute` that calls `isAuthenticated()` in `beforeLoad` and throws a redirect to `/login` if the check fails.

## API

`src/lib/api.js` wraps `fetch` with JWT auth (token stored in `localStorage` as `access_token`). All requests go to `/api`, which Vite proxies to `http://localhost:8000` in dev. A 401 response clears the token and hard-navigates to `/login`.

**Auth endpoints:** `POST /users` (register), `POST /users/login` (form-data, returns JWT), `GET /users/me`, `PATCH /users/me`

**Task endpoints:** `GET /tasks`, `POST /tasks` (body: `{ uri }`), `GET /tasks/:id`, `POST /tasks/:id/cancel`, `GET /tasks/:id/video`, `GET /tasks/:id/audio`, `GET /tasks/:id/transcript`

## CSS / Theming

Tailwind v4 is configured via `@tailwindcss/vite`. Custom design tokens are declared in the `@theme {}` block in `src/index.css` (e.g. `--color-primary`, `--color-card`, `--color-border`). The palette is dark-only — there is no light mode.

**SVG icons:** Sprite sheet at `public/icons.svg`, referenced via `<use href="/icons.svg#icon-name">`.

## Data Fetching Patterns

- `useTasks` polls every 5 s when any task has `status === 'pending' | 'running'`
- `useTask(taskId)` polls every 3 s while the individual task is active
- Query keys: `['user']`, `['tasks']`, `['task', taskId]`, `['transcript', taskId]`
