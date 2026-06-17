import axios from 'axios';

// ---------------------------------------------------------------------
// Axios instance — this is what real API calls would go through.
// Right now nothing actually hits this baseURL (see the mocked functions
// below), but the instance is wired up so swapping the mock logic for
// real `api.post(...)` calls later is a small, contained change.
// ---------------------------------------------------------------------
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the stored token to every outgoing request, the same way it
// would need to happen against a real authenticated API.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------
// Mock "database" + helpers
// ---------------------------------------------------------------------
const USERS_KEY = 'auth_users'; // simulated user table
const TOKEN_KEY = 'authToken';
const CURRENT_USER_KEY = 'authUser';
const MOCK_DELAY_MS = 700; // pretend network latency so loading states are visible

const getStoredUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const generateFakeToken = (email) =>
  // Not a real JWT — just something token-shaped for a practice project.
  btoa(`${email}:${Date.now()}:${Math.random().toString(36).slice(2)}`);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------

/**
 * Registers a new user.
 * Simulates a real API call: random-ish latency, and a rejected promise
 * for the "email already exists" edge case, just like a backend would
 * respond with a 409.
 */
export const registerUser = async ({ fullName, email, password }) => {
  await delay(MOCK_DELAY_MS);

  const users = getStoredUsers();
  const alreadyExists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (alreadyExists) {
    throw new Error('An account with this email already exists.');
  }

  // NOTE: storing plaintext passwords is only acceptable because this is
  // a local mock with no real backend. A real authService would never
  // see or store a raw password — that belongs entirely on the server.
  const newUser = { fullName, email, password };
  users.push(newUser);
  saveStoredUsers(users);

  const token = generateFakeToken(email);
  const safeUser = { fullName, email }; // never persist password in the session
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

  return { user: safeUser, token };
};

/**
 * Logs a user in against the mock "database".
 * Rejects for both "no such email" and "wrong password" with the same
 * generic message — mirrors real APIs that avoid confirming which part
 * of the credentials was wrong, to discourage account enumeration.
 */
export const loginUser = async ({ email, password }) => {
  await delay(MOCK_DELAY_MS);

  const users = getStoredUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!match) {
    throw new Error('Invalid email or password.');
  }

  const token = generateFakeToken(email);
  const safeUser = { fullName: match.fullName, email: match.email };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

  return { user: safeUser, token };
};

/**
 * Clears the session. Kept async/Promise-based to match the shape of a
 * real call (some backends invalidate the token server-side on logout).
 */
export const logoutUser = async () => {
  await delay(150);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

/**
 * Synchronous read of whatever session is currently stored.
 * Used on app load to restore state without waiting on a network call.
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!token || !rawUser) return null;
  try {
    return { user: JSON.parse(rawUser), token };
  } catch {
    return null;
  }
};
