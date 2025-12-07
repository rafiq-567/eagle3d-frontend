
'use client';
import { useEffect } from 'react';
import { useMeQuery } from '@/src/services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/src/features/auth/authSlice';

export default function HydrateAuth() {
  const dispatch = useDispatch();
  const isServer = typeof window === 'undefined';

  const { data, isSuccess } = useMeQuery(undefined, {
    skip: isServer,  
    pollingInterval: 0,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setCredentials({ user: data.user }));
    }
  }, [isSuccess, data, dispatch]);

  return null;
}