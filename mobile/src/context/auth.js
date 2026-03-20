import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {
  saveTokens,
  getStoredTokens,
  clearTokens,
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
  googleOAuth,
  facebookOAuth,
  updateUserProfile,
  deactivateUserAccount,
  savePushToken,
} from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true); // bootstrapping
  const [authError, setAuthError] = useState('');

  const refreshTimerRef = useRef(null);

  // ── Bootstrap: restore session from SecureStore ───────────────
  useEffect(() => {
    (async () => {
      try {
        const { accessToken: at, refreshToken: rt, user: u } = await getStoredTokens();
        if (rt && u) {
          // Try to refresh immediately to get a fresh access token
          try {
            const refreshed = await refreshAccessToken(rt);
            await saveTokens(refreshed.accessToken, refreshed.refreshToken, refreshed.user);
            setUser(refreshed.user);
            setAccessToken(refreshed.accessToken);
            setRefreshToken(refreshed.refreshToken);
            scheduleRefresh(refreshed.accessToken);
          } catch {
            // Refresh token expired — clear session
            await clearTokens();
          }
        }
      } catch {
        await clearTokens();
      } finally {
        setLoading(false);
      }
    })();
    return () => clearTimerIfSet();
  }, []);

  // ── Auto-refresh access token every 13 minutes ────────────────
  const scheduleRefresh = (currentAccessToken) => {
    clearTimerIfSet();
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const { refreshToken: rt } = await getStoredTokens();
        if (!rt) return;
        const refreshed = await refreshAccessToken(rt);
        await saveTokens(refreshed.accessToken, refreshed.refreshToken, refreshed.user);
        setUser(refreshed.user);
        setAccessToken(refreshed.accessToken);
        setRefreshToken(refreshed.refreshToken);
        scheduleRefresh(refreshed.accessToken);
      } catch {
        await clearSession();
      }
    }, 13 * 60 * 1000);
  };

  const clearTimerIfSet = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  // ── Register push token with backend ─────────────────────────
  const registerPushToken = async (token) => {
    try {
      if (!Device.isDevice) return;
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
      if (token && expoPushToken) {
        await savePushToken(token, expoPushToken);
      }
    } catch {}
  };

  // ── Login ─────────────────────────────────────────────────────
  const login = async (email, password) => {
    setAuthError('');
    const data = await loginUser({ email, password });
    await saveTokens(data.accessToken, data.refreshToken, data.user);
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    scheduleRefresh(data.accessToken);
    await registerPushToken(data.accessToken);
  };

  // ── Register ──────────────────────────────────────────────────
  const register = async (firstName, lastName, email, password) => {
    setAuthError('');
    const data = await registerUser({ firstName, lastName, email, password });
    await saveTokens(data.accessToken, data.refreshToken, data.user);
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    scheduleRefresh(data.accessToken);
    await registerPushToken(data.accessToken);
  };

  // ── Google login ──────────────────────────────────────────────
  const loginWithGoogle = async (googlePayload) => {
    setAuthError('');
    const data = await googleOAuth(googlePayload);
    await saveTokens(data.accessToken, data.refreshToken, data.user);
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    scheduleRefresh(data.accessToken);
    await registerPushToken(data.accessToken);
  };

  // ── Facebook login ────────────────────────────────────────────
  const loginWithFacebook = async (fbPayload) => {
    setAuthError('');
    const data = await facebookOAuth(fbPayload);
    await saveTokens(data.accessToken, data.refreshToken, data.user);
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    scheduleRefresh(data.accessToken);
    await registerPushToken(data.accessToken);
  };

  // ── Update profile ────────────────────────────────────────────
  const updateProfile = async (formData) => {
    const updated = await updateUserProfile(accessToken, formData);
    const newUser = { ...user, ...updated };
    setUser(newUser);
    await saveTokens(accessToken, refreshToken, newUser);
    return updated;
  };

  // ── Logout ────────────────────────────────────────────────────
  const logout = async () => {
    clearTimerIfSet();
    await logoutUser(accessToken);
    await clearSession();
  };

  // ── Deactivate ────────────────────────────────────────────────
  const deactivate = async () => {
    clearTimerIfSet();
    await deactivateUserAccount(accessToken);
    await clearSession();
  };

  const clearSession = async () => {
    await clearTokens();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        authError,
        setAuthError,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        updateProfile,
        logout,
        deactivate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};