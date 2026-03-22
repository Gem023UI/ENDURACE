import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.68.138:5000';
const API = `${BASE_URL}/api/orders`;

// ── Place a new order ─────────────────────────────────────────────
export const placeOrder = async ({ items, total, shippingAddress, paymentMethod }, accessToken) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ items, total, shippingAddress, paymentMethod }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.order;
};

// ── Get current user's orders ─────────────────────────────────────
export const fetchMyOrders = async (accessToken) => {
  const res = await fetch(`${API}/my`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.orders;
};

// ── Get single order by ID ────────────────────────────────────────
export const fetchOrderById = async (id, accessToken) => {
  const res = await fetch(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.order;
};

// ── Admin: get all orders ─────────────────────────────────────────
export const fetchAllOrders = async (accessToken) => {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.orders;
};

// ── Admin: update order status ────────────────────────────────────
export const updateStatus = async (id, status, accessToken) => {
  const res = await fetch(`${API}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.order;
};