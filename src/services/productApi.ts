import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, AddProductPayload, UpdateProductPayload } from '../types/shared.types';
import { firestore } from '../../lib/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    credentials: 'include', // include cookies so session cookie is sent
  }),
  tagTypes: ['Products'],
  endpoints: (build) => ({
    // GET /api/products (initial fetch, but real-time will patch cache via onCacheEntryAdded)
    getProducts: build.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Products'],
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // Wait for the initial cache to be ready
        try {
          await cacheDataLoaded;
        } catch {
          // cache removed before ready
          return;
        }

        // Create a Firestore query for the products collection
        const productsCol = collection(firestore, 'products');
        const q = query(productsCol, orderBy('createdAt', 'desc'));

        // Listen for real-time updates; apply them to the RTK cache
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const products: Product[] = snapshot.docs.map((doc) => {
              const data = doc.data() as DocumentData;
              return {
                id: doc.id,
                name: data.name ?? '',
                description: data.description ?? '',
                price: Number(data.price ?? 0),
                stock: Number(data.stock ?? 0),
                
                status: data.status ?? undefined,
              } as Product;
            });

           
            updateCachedData((draft) => {
              // replace entire array
              return products;
            });
          },
          (error) => {
            console.error('[productApi:onSnapshot] snapshot error:', error);
          }
        );

        // When the cache subscription is removed, unsubscribe from Firestore
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),

    // POST /api/products (create) - protected API (session cookie sent)
    addProduct: build.mutation<{ id: string; message: string; product: Product }, AddProductPayload>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'], // minor; onSnapshot will update cache anyway
    }),

    // PUT /api/products/:id
    updateProduct: build.mutation<{ message: string }, { id: string; data: UpdateProductPayload }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    // DELETE /api/products/:id
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
