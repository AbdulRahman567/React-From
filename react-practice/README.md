# React Auth Practice

A practice registration/login system: React (Vite) + Formik + Yup + React Router + Axios-shaped mock backend.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL — you'll land on `/login`.

## What's mocked vs. real

Everything in `src/services/authService.js` runs against `localStorage` instead of a real server: registering writes to a fake `auth_users` table, logging in checks against it, and a base64 string stands in for a JWT. An Axios instance (`api`) is configured with a request interceptor that attaches the stored token — that's the part that would carry over unchanged if you pointed it at a real backend; only the bodies of `registerUser`/`loginUser`/`logoutUser` would change to `api.post(...)` calls.

## Two files beyond the original spec

- `src/components/ProtectedRoute.jsx` — a small guard component. The spec asked for `/dashboard` to redirect unauthenticated users to `/login`; this is what does that check, using `useAuth()`.
- `src/pages/Dashboard.jsx` — `/dashboard` needed something to render. It shows the logged-in user's name/email and a logout button.

## Things worth poking at to see the edge cases

- Submit the register form empty — every field gets a "required" error after Formik marks them touched.
- Try a weak password (`abc12345`) — see the specific rule it's missing.
- Mismatch the confirm-password field.
- Register the same email twice — the second attempt rejects with "account already exists" (simulated server-side check).
- Double-click submit — the button disables itself the instant `isSubmitting` flips to true.
- Log in with the wrong password — same generic error message either way, on purpose.
- Refresh the page while logged in — the session survives (read synchronously from `localStorage` on load).
- Visit `/dashboard` directly while logged out — bounced to `/login`.
