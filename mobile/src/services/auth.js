import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.1:5000';
const API = `${BASE_URL}/api/auth`;

const KEYS = {
  ACCESS: 'endurace_access_token',
  REFRESH: 'endurace_refresh_token',
  USER: 'endurace_user',
};

// ── Token Storage ─────────────────────────────────────────────────
export const saveTokens = async (accessToken, refreshToken, user) => {
  await SecureStore.setItemAsync(KEYS.ACCESS, accessToken);
  await SecureStore.setItemAsync(KEYS.REFRESH, refreshToken);
  await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user));
};

export const getStoredTokens = async () => {
  const accessToken = await SecureStore.getItemAsync(KEYS.ACCESS);
  const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH);
  const userStr = await SecureStore.getItemAsync(KEYS.USER);
  const user = userStr ? JSON.parse(userStr) : null;
  return { accessToken, refreshToken, user };
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(KEYS.ACCESS);
  await SecureStore.deleteItemAsync(KEYS.REFRESH);
  await SecureStore.deleteItemAsync(KEYS.USER);
};

// ── Auth Requests ─────────────────────────────────────────────────
export const registerUser = async ({ firstName, lastName, email, password }) => {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const refreshAccessToken = async (refreshToken) => {
  const res = await fetch(`${API}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const logoutUser = async (accessToken) => {
  await fetch(`${API}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await clearTokens();
};

export const googleOAuth = async (payload) => {
  const res = await fetch(`${API}/oauth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const facebookOAuth = async (payload) => {
  const res = await fetch(`${API}/oauth/facebook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const fetchProfile = async (accessToken) => {
  const res = await fetch(`${API}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.user;
};

export const updateUserProfile = async (accessToken, formData) => {
  const res = await fetch(`${API}/profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.user;
};

export const savePushToken = async (accessToken, pushToken) => {
  await fetch(`${API}/push-token`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pushToken }),
  });
};

export const deactivateUserAccount = async (accessToken) => {
  const res = await fetch(`${API}/deactivate`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  await clearTokens();
  return data;
};