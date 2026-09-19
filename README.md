# Academic Enrollment Dashboard

React 19 + TypeScript single-page interface for managing academic KRS records, students, and courses.

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

## Quality checks

```bash
npm run lint
npm run build
```

Pages are route-level lazy loaded. Recharts is isolated in the dashboard chunk instead of increasing the initial application bundle.

## Query behavior

Search waits 400 ms before requesting data and resets pagination to page one. Stale Axios requests are cancelled. Quick and advanced filters are sent to the API; no dataset-wide filtering or sorting is performed in the browser.

CSV export serializes the currently active search, quick filters, advanced conditions, and AND/OR logic, then lets the browser stream the file directly from the API.
