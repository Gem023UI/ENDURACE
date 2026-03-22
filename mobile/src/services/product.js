import Constants from 'expo-constants';

// Set your backend URL in app.json extra.apiUrl or just hardcode for dev
const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.68.138:5000';

const API = `${BASE_URL}/api`;

// ── GET all products (supports query params) ──────────────────────
export const fetchProducts = async ({ category, search, minPrice, maxPrice } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== 'ALL') params.append('category', category);
  if (search) params.append('search', search);
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);

  const res = await fetch(`${API}/products?${params.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.products;
};

// ── GET single product ────────────────────────────────────────────
export const fetchProductById = async (id) => {
  const res = await fetch(`${API}/products/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.product;
};

// ── CREATE product (FormData with images) ────────────────────────
export const createProduct = async (formData) => {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type — let fetch set multipart/form-data with boundary
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.product;
};

// ── UPDATE product ────────────────────────────────────────────────
export const updateProduct = async (id, formData) => {
  const res = await fetch(`${API}/products/${id}`, {
    method: 'PUT',
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.product;
};

// ── DELETE product ────────────────────────────────────────────────
export const deleteProduct = async (id) => {
  const res = await fetch(`${API}/products/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};