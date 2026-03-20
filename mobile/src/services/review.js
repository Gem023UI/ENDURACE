import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.1:5000';
const API = `${BASE_URL}/api/reviews`;

// ── GET reviews for a product ─────────────────────────────────────
export const fetchProductReviews = async (productId) => {
  const res = await fetch(`${API}/product/${productId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.reviews;
};

// ── GET current user's reviews ────────────────────────────────────
export const fetchMyReviews = async (accessToken) => {
  const res = await fetch(`${API}/mine`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.reviews;
};

// ── CHECK if user can review a product ───────────────────────────
export const checkCanReview = async (productId, accessToken) => {
  const res = await fetch(`${API}/can-review/${productId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data; // { canReview, orderId?, existingReview? }
};

// ── CREATE review ─────────────────────────────────────────────────
export const submitReview = async ({ productId, orderId, rating, comment }, accessToken) => {
  const res = await fetch(`${API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId, orderId, rating, comment }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.review;
};

// ── UPDATE review ─────────────────────────────────────────────────
export const editReview = async (reviewId, { rating, comment }, accessToken) => {
  const res = await fetch(`${API}/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ rating, comment }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.review;
};

// ── DELETE review ─────────────────────────────────────────────────
export const removeReview = async (reviewId, accessToken) => {
  const res = await fetch(`${API}/${reviewId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};