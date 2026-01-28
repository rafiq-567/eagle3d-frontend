// src/config/api.ts
export const API_CONFIG = {
  // Always use the backend URL directly (no proxy for now)
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://eagle3d-backend-12.onrender.com/api',
  
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      me: '/auth/me',
      register: '/auth/register',
    },
    products: {
      list: '/products',
      stream: '/products/stream',
      create: '/products',
      update: (id: string) => `/products/${id}`,
      delete: (id: string) => `/products/${id}`,
    }
  },
  
  getURL: (endpoint: string) => {
    return `${API_CONFIG.baseURL}${endpoint}`;
  },

  getFullURL: (endpoint: string) => {
    return `${API_CONFIG.baseURL}${endpoint}`;
  }
};