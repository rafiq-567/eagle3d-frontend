// src/services/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserPayload } from '../types/shared.types';
import { API_CONFIG } from '../config/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseURL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ message: string; user: UserPayload }, { idToken: string }>({
      query: (credentials) => ({
        url: API_CONFIG.endpoints.auth.login,
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: API_CONFIG.endpoints.auth.logout,
        method: 'POST',
      }),
    }),
    getMe: builder.query<{ user: UserPayload }, void>({
      query: () => API_CONFIG.endpoints.auth.me,
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;