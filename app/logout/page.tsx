// 'use client';
// import React, { useEffect } from 'react';
// import { useLogoutMutation } from '../../src/services/authApi';
// import { useRouter } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { logOut } from '../../src/features/auth/authSlice';

// export default function LogoutPage() {
//   const [logout] = useLogoutMutation();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     (async () => {
//       try {
//         await logout().unwrap();
//       } catch (err) {
//         console.error('Logout failed', err);
//       } finally {
//         dispatch(logOut());
//         router.push('/login');
//       }
//     })();
//   }, [logout, dispatch, router]);

//   return <div className="min-h-screen flex items-center justify-center">Logging out...</div>;
// }



'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '../../src/services/authApi';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // ✅ Now this works because logout is typed as <void, void>
        await logout().unwrap();
      } catch (err) {
        console.error('Logout failed', err);
      } finally {
        // Redirect to login regardless of success/failure
        router.push('/login');
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Logging out...</p>
      </div>
    </div>
  );
}