

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
//     credentials: 'include', // IMPORTANT: send session cookie
//   }),
//   tagTypes: ['Auth'],
//   endpoints: (build) => ({
//     login: build.mutation<
//       { message: string; user: { email: string; role: string } },
//       { idToken: string }
//     >({
//       query: (body) => ({
//         url: '/auth/login',
//         method: 'POST',
//         body,
//       }),
//     }),

//     logout: build.mutation<{ message: string }, void>({
//       query: () => ({
//         url: '/auth/logout',
//         method: 'POST',
//       }),
//     }),

//     me: build.query<{ user: { email: string; role: string } }, void>({
//       query: () => '/auth/me',
//       providesTags: ['Auth'],
//     }),
//   }),
// });

// export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../config/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseURL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API_CONFIG.endpoints.auth.login,
        method: 'POST',
        body: credentials,
      }),
    }),
    // ✅ Fix: Add <void, void> to specify return type and argument type
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_CONFIG.endpoints.auth.logout,
        method: 'POST',
      }),
    }),
    getMe: builder.query({
      query: () => API_CONFIG.endpoints.auth.me,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;