# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Environment Setup

Copy `.env.example` to `.env` and set:

- `REACT_APP_API_BASE_URL` → Backend URL (preview/dev is typically `http://localhost:3001` or the preview URL provided)
- `REACT_APP_SUPABASE_URL` → Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` → Your Supabase anon key

On app boot (development), the console logs a safe preview of these values to help validate wiring.

Quick validation checklist:
- Visit the backend docs to confirm availability: http://localhost:3001/docs (or your preview URL)
- In browser devtools console, ensure you see `[Boot] ENV summary` and `[Supabase] Initializing client`
- Ensure `.env` values are loaded (Create React App requires vars prefixed with `REACT_APP_`)

## Realtime Subscriptions

The frontend subscribes to:
- `public:jobs` via `postgres_changes` to reflect inserts/updates/deletes in the Jobs list
- `public:notifications` primarily via `broadcast` event `new_notification`
- If broadcast is not used by your backend, the frontend automatically attaches a fallback `postgres_changes` subscription to the `public.notifications` table (INSERT only)

If updates are not reflected:
1. Check browser console for `[Realtime]` logs (connection status, events)
2. Ensure Realtime is enabled for the `public` schema and that Publications include `jobs` and `notifications` tables
3. For broadcast: verify the event name `new_notification` matches your server emitter and that the channel name is `public:notifications`
4. For `postgres_changes`: verify your Realtime publication includes the tables and RLS allows streaming the rows to anon (or use a JWT with appropriate claims)
5. Confirm CORS and websocket access are not blocked by the backend or proxies

## CORS Verification

The backend exposes a non-sensitive debug endpoint `/api/debug/cors` showing `allow_origins`. Ensure your frontend origin (e.g., `http://localhost:3000`) appears there. API base URL should point to the FastAPI backend preview on port `3001`.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in non-watch mode in CI.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`.

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Troubleshooting

- If you see API CORS errors, verify `REACT_APP_API_BASE_URL` is set and backend CORS allows your frontend origin.
- If realtime doesn’t connect, confirm Supabase env variables are set and that Realtime is enabled for your schema/tables.
- Make sure your Realtime publication includes `public.jobs` and (if using fallback) `public.notifications`.
- For broadcast flows, ensure the backend emits to `public:notifications` with event `new_notification`.
- Check the browser console for `[Boot]`, `[Supabase]`, and `[Realtime]` diagnostics.
