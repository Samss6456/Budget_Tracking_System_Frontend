import axios from "axios";

const baseURL = window.location.host.includes("premiumproject.examly.io")
  ? `${window.location.protocol}//${window.location.hostname.replace(/^8081-/, "8080-")}`
  : "https://budget-tracking-system-backend.onrender.com";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Response interceptor (keep as is)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    if (!error.response) {
      throw new Error('Network error - please check your connection');
    }
    if (error.response.status >= 500) {
      throw new Error('Server error - please try again later');
    }
    throw error;
  }
);

export const addCategory = (category) =>
  api.post("/api/categories", category).then(r => r.data);

export const getCategories = () =>
  api.get("/api/categories").then(r => r.data);

export const getBudgetSummary = () =>
  api.get("/api/categories/summary").then(r => r.data);

export const deleteCategory = (id) =>
  api.delete(`/api/categories/${id}`).then(r => r.data);

export const updateCategory = (id, category) =>
  api.put(`/api/categories/${id}`, category).then(r => r.data);

export const login = (credentials) =>
  api.post("/api/auth/login", credentials).then(r => r.data);

export const register = (credentials) =>
  api.post("/api/auth/register", credentials).then(r => r.data);
