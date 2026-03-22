import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BASE_URL =
  Platform.OS === 'web'
    ? ''
    : Constants.expoConfig?.extra?.apiUrl || 'http://192.168.100.5:5000';

const API = `${BASE_URL}/api/articles`;

const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Server returned non-JSON (status ${res.status}).\nBody: ${text.slice(0, 200)}`);
  }
  return res;
};

export const fetchArticles = async () => {
  const res  = await safeFetch(API);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.articles;
};

export const fetchArticleById = async (id) => {
  const res  = await safeFetch(`${API}/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.article;
};

export const fetchAllArticlesAdmin = async (accessToken) => {
  const res  = await safeFetch(`${API}/admin/all`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.articles;
};

export const createArticleApi = async (payload, accessToken) => {
  const res = await safeFetch(API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.article;
};

export const updateArticleApi = async (id, payload, accessToken) => {
  const res = await safeFetch(`${API}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.article;
};

export const deleteArticleApi = async (id, accessToken) => {
  const res  = await safeFetch(`${API}/${id}`, {
    method:  'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};