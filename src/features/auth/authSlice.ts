import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';


import { UserPayload } from '../../types/shared.types';


interface AuthState {
  user: UserPayload | null; 
}


const initialState: AuthState = {
  user: null, 
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserPayload | null }>
    ) => {
      state.user = action.payload.user;
    },
    
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;


export const selectCurrentUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;