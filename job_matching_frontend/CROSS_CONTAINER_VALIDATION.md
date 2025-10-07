# Cross-Container Validation (Frontend ↔ Backend ↔ Supabase Realtime)

Follow these steps to validate the integration end-to-end:

1) Environment
- Copy .env.example to .env
- Set:
  - REACT_APP_API_BASE_URL=http://localhost:3001 (or your preview URL)
  - REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON
- Start frontend: npm start
- Open browser console and verify:
  - [Boot] ENV summary
  - [Supabase] Initializing client
  - [Realtime] socket open

2) Backend CORS
- Open http://localhost:3001/api/debug/cors
- Ensure your frontend origin (e.g., http://localhost:3000) is permitted.

3) Jobs Realtime
- Open the Jobs page in the frontend
- From backend or DB, create/update/delete a job row (public.jobs)
- Verify [Realtime] jobs change appears in console and UI updates

4) Notifications
- If backend emits broadcast events:
  - Emit to channel "public:notifications" with event "new_notification"
  - Observe [Realtime] notification broadcast and topbar count increase
- If backend uses DB inserts only:
  - Insert into public.notifications
  - UI will pick it up via the postgres_changes fallback

5) Supabase Realtime Publication and Policies
- Ensure publication includes public.jobs and public.notifications
- Confirm RLS allows the rows to be streamed to anon (or use JWT with appropriate claims)

If issues persist, capture console logs with [Realtime] prefix and verify environment variables in .env.
