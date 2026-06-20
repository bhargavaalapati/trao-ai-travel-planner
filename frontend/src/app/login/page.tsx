'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';
import { AuthResponse } from '@/types';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Dynamically pick the route based on our toggle state
        const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';

        try {
            const data: AuthResponse = await fetchWithAuth(endpoint, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null; // Hydration fix

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-3xl mb-4 hover:scale-110 transition-transform">✈️</Link>
                    <h2 className="text-3xl font-extrabold text-white">
                        {isLoginView ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        {isLoginView ? 'Sign in to access your secure vault.' : 'Start planning your perfect trip in seconds.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl text-sm mb-6 text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            placeholder="engineer@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : (isLoginView ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-800 pt-6">
                    <p className="text-sm text-slate-400">
                        {isLoginView ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginView(!isLoginView);
                                setError(''); // clear errors on toggle
                            }}
                            className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition"
                        >
                            {isLoginView ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}