import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, AddProductPayload, UpdateProductPayload } from '../types/shared.types';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    credentials: 'include',
  }),
  tagTypes: ['Products'],
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Products'],

      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
        } catch {
          return;
        }

        const eventSource = new EventSource(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/stream`,
          { withCredentials: true }
        );

        eventSource.onmessage = (event) => {
          try {
            const products = JSON.parse(event.data);
            updateCachedData(() => products);
          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          eventSource.close();
        };

        await cacheEntryRemoved;
        eventSource.close();
      },
    }),

    addProduct: build.mutation<{ id: string; message: string; product: Product }, AddProductPayload>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: build.mutation<{ message: string }, { id: string; data: UpdateProductPayload }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    deleteProduct: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;