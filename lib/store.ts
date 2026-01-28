// import { configureStore } from '@reduxjs/toolkit';


// import authReducer from '@/src/features/auth/authSlice';
// import { productApi } from '@/src/services/productApi';
// import { authApi } from '@/src/services/authApi';


// export const store = configureStore({
//   reducer: {
  
//     auth: authReducer,

//     // RTK Query API Reducers
//     [authApi.reducerPath]: authApi.reducer,
//     [productApi.reducerPath]: productApi.reducer,
//   },
  
  
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       authApi.middleware, 
//       productApi.middleware
//     ),
  
 
//   devTools: process.env.NODE_ENV !== 'production',
// });


// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


// src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';


import authReducer from '@/src/features/auth/authSlice';
import { productApi } from '@/src/services/productApi';
import { authApi } from '@/src/services/authApi';

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(authApi.middleware),
      devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;