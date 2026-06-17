import { createContext, useContext, useState, useCallback, createElement } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Wraps the app and owns the single source of truth for auth state.
 * A hook alone can't share state across components — each call to a
 * plain hook gets its own state. Context is what makes Login, Register,
 * Dashboard, and ProtectedRoute all agree on who's logged in.
 */
export function AuthProvider({ children }) {
  // Restore any existing session synchronously on first render so the
  // app doesn't flash a "logged out" state before a useEffect runs.
  const [session, setSession] = useState(() => authService.getCurrentUser());

  const register = useCallback(async (values) => {
    const { user, token } = await authService.registerUser(values);
    setSession({ user, token });
    return user;
  }, []);

  const login = useCallback(async (values) => {
    const { user, token } = await authService.loginUser(values);
    setSession({ user, token });
    return user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logoutUser();
    setSession(null);
  }, []);

  const value = {
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    register,
    login,
    logout,
  };

  // Plain createElement (no JSX) so this file can keep a .js extension —
  // Vite's default config only enables the JSX transform for .jsx files.
  return createElement(AuthContext.Provider, { value }, children);
}

/**
 * Access auth state and actions from any component.
 * Throws clearly if used outside the provider, instead of silently
 * returning undefined and causing a confusing crash somewhere else.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}
