

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    credentials: 'include', // IMPORTANT: send session cookie
  }),
  tagTypes: ['Auth'],
  endpoints: (build) => ({
    login: build.mutation<
      { message: string; user: { email: string; role: string } },
      { idToken: string }
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    logout: build.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    me: build.query<{ user: { email: string; role: string } }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;
