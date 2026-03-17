# Instagram Reel Downloader — Frontend

A web app that lets you download Instagram Reels as video, audio, and transcript. Paste a reel URL, wait for the backend to process it, and get your files — all from a clean browser interface.

The app handles authentication, submits reel URLs to a backend API, tracks processing progress in real time, and lets you play or download the results when ready.

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
- **Backend API** running on port `8000` — the app won't work without it (login, registration, and reel processing all go through the backend)

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server
pnpm dev
```

The app will be available at **http://localhost:5173**.

> In development, all API requests are automatically proxied to `http://localhost:8000`, so you don't need any extra configuration.

## How It Works

1. **Register or log in** — create an account or sign in with your credentials.
2. **Submit a reel URL** — paste any public Instagram Reel URL into the dashboard and submit.
3. **Track progress** — the app polls the backend and shows you the current status (pending → running → completed).
4. **Get your files** — once processing is complete, you can:
   - Watch the video inline
   - Listen to the extracted audio
   - Read the transcript
   - Download everything as a zip archive

## Pages

| Route | Description |
|---|---|
| `/login` | Sign in to your account |
| `/register` | Create a new account |
| `/` | Dashboard — submit new reels and view your task list |
| `/tasks/:taskId` | Task detail — status, media player, transcript, and download |
| `/settings` | Update your profile |

Visiting a protected page without being logged in redirects you to `/login`.

## Available Scripts

```bash
pnpm dev        # Start dev server with Hot Module Replacement
pnpm build      # Production build → dist/
pnpm preview    # Preview the production build locally
pnpm lint       # Run ESLint
```

## Docker (Production)

```bash
# Create the shared Docker network (once)
docker network create instagram-reel-downloader

# Build and start the container
docker compose build
docker compose up -d
```

The app will be available at **http://localhost:3000**.

> The backend must also be attached to the `instagram-reel-downloader` Docker network and reachable under the hostname **`api`**. nginx proxies all `/api/*` requests to the backend, mirroring the Vite dev proxy behavior.
