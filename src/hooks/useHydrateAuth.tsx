'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logOut, setCredentials } from '../features/auth/authSlice';


export default function HydrateAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });

        if (res.ok) {
          const user = await res.json();
          dispatch(setCredentials({ user }));
        } else {
          // User not authenticated - this is normal, don't log anything
          dispatch(logOut());
        }
      } catch (error) {
        // Network error - only log if it's not a 401
        // 401 is expected when not logged in, so we silently handle it
        dispatch(logOut());
      }
    };

    checkAuth();
  }, [dispatch]);

  return null;
}