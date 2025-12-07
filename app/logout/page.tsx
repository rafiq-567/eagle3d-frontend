'use client';
import React, { useEffect } from 'react';
import { useLogoutMutation } from '../../src/services/authApi';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logOut } from '../../src/features/auth/authSlice';

export default function LogoutPage() {
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        await logout().unwrap();
      } catch (err) {
        console.error('Logout failed', err);
      } finally {
        dispatch(logOut());
        router.push('/login');
      }
    })();
  }, [logout, dispatch, router]);

  return <div className="min-h-screen flex items-center justify-center">Logging out...</div>;
}
