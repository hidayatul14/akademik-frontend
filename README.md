# SIAKAD — Academic Enrollment Dashboard

React 19 + TypeScript single-page interface for managing academic KRS records, students, and courses.

## Live demo

- [Dashboard](https://akademik-frontend-1swy.vercel.app)
- [Backend API sample](https://akademik-api-production-6aad.up.railway.app/api/enrollments?page=1&page_size=2)

The online Railway database is initially seeded with **1,000 synthetic enrollments**; the current count may change as visitors test CRUD. The five-million-row benchmark is run locally in the backend project, not on the hosted demo. Railway currently uses trial credit, so its availability depends on the account's service status and remaining credit. The API does not require login: use test data only.

## Features

- Server-side pagination with selectable page size and total records
- Multi-column server-side sorting
- Debounced server-side search
- Quick filters for status and semester
- Advanced multi-filter drawer with AND/OR logic
- Atomic KRS create workflow for student, course, and enrollment data
- Frontend and backend validation feedback
- Filter-aware CSV export
- Responsive tables, mobile navigation, skeletons, empty states, and error states
- Accessible dialogs, focus styles, labels, and notifications

## Local setup

```bash
npm ci
cp .env.example .env
npm run dev -- --host 127.0.0.1 --port 5173
```

Configure the local API:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Open http://127.0.0.1:5173.

## Vercel deployment

Import this repository into Vercel with framework **Vite**, build command `npm run build`, and output directory `dist`. Under **Project Settings → Environment Variables**, set the **Production** variable:

```dotenv
VITE_API_BASE_URL=https://akademik-api-production-6aad.up.railway.app/api
```

Redeploy after changing the variable: Vite embeds `VITE_` values in the browser bundle at build time. These values are public, so never put database passwords or private API keys in them. The `vercel.json` rewrite allows direct navigation to SPA routes such as `/enrollments`. On the backend, set `CORS_ALLOWED_ORIGINS=https://akademik-frontend-1swy.vercel.app` (or your exact Vercel origin) and redeploy if it changes. See the [backend README](https://github.com/hidayatul14/akademik-api#readme) for API and database setup.

## Quality checks

```bash
npm run lint
npm run build
```

Pages are route-level lazy loaded. Check `/`, `/enrollments`, `/students`, and `/courses` after deployment, including direct refresh on each route. A successful frontend build does not verify the API: confirm that the dashboard count loads, then test listing, filtering, create, update, delete, and CSV export against synthetic data.

## Query behavior

Search waits 400 ms before requesting data and resets pagination to page one. Stale Axios requests are cancelled. Quick and advanced filters are sent to the API; no dataset-wide filtering or sorting is performed in the browser.

CSV export serializes the currently active search, quick filters, advanced conditions, and AND/OR logic, then lets the browser stream the file directly from the API.
