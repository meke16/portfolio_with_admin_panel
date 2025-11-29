# Portfolio with Admin Panel

> A full-stack portfolio project with an admin panel — React + Vite frontend, Express + TypeScript backend, Drizzle ORM for database schema, and Tailwind CSS for styling.

## Quick Overview

- **Purpose:** Personal portfolio site with an admin area for managing projects, messages, and profile content.
- **Frontend:** `client/` — Vite + React (TSX), Tailwind CSS, components and pages.
- **Backend:** `server/` — Express + TypeScript server, routes, storage, and Vite integration for development.
- **Shared types/schema:** `shared/` contains database/schema definitions used by both client and server.

## Repo Structure (important files)

- `client/` : Frontend application built with Vite + React.
  - `src/` : App entry, pages, components, UI primitives, hooks, and lib helpers.
  - `index.html`, `main.tsx`, `App.tsx` : Vite entry files.
- `server/` : Express server and utilities.
  - `index.ts` : Server entry (started by the dev script).
  - `routes.ts` : HTTP routes.
  - `vite.ts` : Vite integration for dev (used when running the dev script).
  - `static.ts`, `storage.ts`, `db.ts` : static serving, file storage, and DB utilities.
- `shared/` : Shared schema and types (e.g., `schema.ts`) for Drizzle.
- `script/` : build and helper scripts (`build.ts` used by `npm run build`).
- `components.json`, `design_guidelines.md`, `postcss.config.js`, `tailwind.config.ts`, `drizzle.config.ts` : project config and design docs.

## Tech Stack

- TypeScript
- React + Vite
- Express
- Tailwind CSS
- Drizzle ORM + drizzle-kit
- tsx for running TypeScript entry scripts in dev

## Environment

Create a `.env` in the project root (the dev script loads it). Typical variables the server expects may include:

- `DATABASE_URL` — your Postgres or Neon connection string
- `SESSION_SECRET` — session signing key
- `PORT` — server port (defaults may be in `server/index.ts`)

Refer to `server/index.ts` and any README or docs for exact required variables.

## Scripts

The project scripts are defined in `package.json`.

- Start development (runs the server in development mode and integrates Vite for frontend hot-reload):

```bash
npm run dev
```

- Build the project (uses `script/build.ts`):

```bash
npm run build
```

- Start production (run built server entry):

```bash
npm run start
```

- Type-check the codebase:

```bash
npm run check
```

- Database schema commands (drizzle-kit):

```bash
npm run db:push   # push schema changes to the database
npm run db:pull   # pull schema from the database
```

Note: The `dev` script in this repo runs `tsx --env-file=.env server/index.ts` which boots the Express server and (via `server/vite.ts`) typically proxies or serves the frontend in development.

## Developing

1. Install dependencies:

```bash
npm install
```

2. Add a `.env` file with required environment variables.

3. Run the development server:

```bash
npm run dev
```

4. Open the site at the port printed by the server (commonly `http://localhost:5173` for Vite or as logged by the Express server).

## Building & Deploy

- Run `npm run build` to produce a production build via `script/build.ts`.
- Deploy the built `dist/` output and run `npm run start` (ensure environment variables are set for production).

## Database

- This project uses Drizzle ORM. Use `npm run db:push` and `npm run db:pull` (drizzle-kit) to manage migrations/schema sync.
- See `drizzle.config.ts` and `shared/schema.ts` for schema configuration.

## Contributing

- Keep TypeScript types synchronized between `shared/` and server/client.
- Run `npm run check` before committing.

## Where to look next

- Frontend: `client/src/components` and `client/src/pages`
- Admin pages: `client/src/pages/admin` and `client/src/components/admin`
- Server routes and middleware: `server/routes.ts`, `server/index.ts`

---

If you want, I can also:

- Add a short `CONTRIBUTING.md` or developer checklist.
- Add an example `.env.example` file listing environment variables.

Feel free to tell me which of those you want me to add next.
