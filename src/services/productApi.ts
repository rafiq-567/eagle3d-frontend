// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { Product, AddProductPayload, UpdateProductPayload } from '../types/shared.types';

// export const productApi = createApi({
//   reducerPath: 'productApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
//     credentials: 'include',
//   }),
//   tagTypes: ['Products'],
//   endpoints: (build) => ({
//     getProducts: build.query<Product[], void>({
//       query: () => '/products',
//       providesTags: ['Products'],

//       async onCacheEntryAdded(
//         _arg,
//         { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
//       ) {
//         try {
//           await cacheDataLoaded;
//         } catch {
//           return;
//         }

//         const eventSource = new EventSource(
//           `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/stream`,
//           { withCredentials: true }
//         );

//         eventSource.onmessage = (event) => {
//           try {
//             const products = JSON.parse(event.data);
//             updateCachedData(() => products);
//           } catch (error) {
//             console.error('Error parsing SSE data:', error);
//           }
//         };

//         eventSource.onerror = (error) => {
//           console.error('SSE connection error:', error);
//           eventSource.close();
//         };

//         await cacheEntryRemoved;
//         eventSource.close();
//       },
//     }),

//     addProduct: build.mutation<{ id: string; message: string; product: Product }, AddProductPayload>({
//       query: (product) => ({
//         url: '/products',
//         method: 'POST',
//         body: product,
//       }),
//       invalidatesTags: ['Products'],
//     }),

//     updateProduct: build.mutation<{ message: string }, { id: string; data: UpdateProductPayload }>({
//       query: ({ id, data }) => ({
//         url: `/products/${id}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['Products'],
//     }),

//     deleteProduct: build.mutation<{ message: string }, string>({
//       query: (id) => ({
//         url: `/products/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Products'],
//     }),
//   }),
// });

// export const {
//   useGetProductsQuery,
//   useAddProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
// } = productApi;


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, AddProductPayload, UpdateProductPayload } from '../types/shared.types';
import { API_CONFIG } from '../config/api';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseURL,  // ✅ FIXED: Uses config instead of hardcoded
    credentials: 'include',
  }),
  tagTypes: ['Products'],
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => API_CONFIG.endpoints.products.list,  // ✅ FIXED
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

        // ✅ FIXED: EventSource now uses API_CONFIG
        const eventSource = new EventSource(
          API_CONFIG.getURL(API_CONFIG.endpoints.products.stream),
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
        url: API_CONFIG.endpoints.products.create,  // ✅ FIXED
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: build.mutation<{ message: string }, { id: string; data: UpdateProductPayload }>({
      query: ({ id, data }) => ({
        url: API_CONFIG.endpoints.products.update(id),  // ✅ FIXED
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    deleteProduct: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: API_CONFIG.endpoints.products.delete(id),  // ✅ FIXED
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