
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useLoginMutation } from '../../src/services/authApi';
import { Loader2, Lock, Mail } from 'lucide-react';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);

    const router = useRouter();
    const [login, { isLoading, isError, error }] = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);

        try {
            // Firebase login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Get fresh ID token
            const idToken = await userCredential.user.getIdToken(true);

            // Send to backend
            await login({ idToken }).unwrap();

            // Successful → redirect to products
            router.push('/products');

        } catch (err: any) {
            console.error('Login failed:', err);

            let errorMessage = 'Login failed. Wrong email or password.';

            if (err.code && typeof err.code === 'string') {
                switch (err.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        errorMessage = 'Wrong email or password. Try again.';
                        break;
                    default:
                        errorMessage = `Firebase error: ${err.code}`;
                }
                setAuthError(errorMessage);
            }

            else if (err.data?.message) {
                setAuthError(`Server error: ${err.data.message}`);
            }

            else {
                setAuthError('Server connection failed. Please check your internet.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6">

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Eagle3D Admin Login
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Login to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                required
                                placeholder="Strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {(isError || authError) && (
                    <p className="text-center text-sm text-red-500 mt-4">
                        {authError || `Login error: ${(error as any)?.data?.message || 'Unknown error'}`}
                    </p>
                )}
            </div>
        </div>
    );
}

