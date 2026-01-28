export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  
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
  }
};