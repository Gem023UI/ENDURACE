import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.68.138:5000';
const API = `${BASE_URL}/api/discounts`;

// ── Validate a code at checkout (authenticated user) ──────────────
export const validateDiscountCode = async (code, orderTotal, accessToken) => {
  const res = await fetch(`${API}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ code, orderTotal }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.discount;
};

// ── Admin: fetch all discount codes ──────────────────────────────
export const fetchAllDiscounts = async (accessToken) => {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.discounts;
};

// ── Admin: create a discount code ─────────────────────────────────
export const createDiscountCode = async (payload, accessToken) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.discount;
};

// ── Admin: update a discount code ─────────────────────────────────
export const updateDiscountCode = async (id, payload, accessToken) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.discount;
};

// ── Admin: delete a discount code ─────────────────────────────────
export const deleteDiscountCode = async (id, accessToken) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

// ── Admin: broadcast promo notification ───────────────────────────
export const broadcastPromoNotification = async ({ title, body, discountCode }, accessToken) => {
  const res = await fetch(`${BASE_URL}/api/promo/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title, body, discountCode }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};