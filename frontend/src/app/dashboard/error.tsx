'use client';

import { useEffect } from 'react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Captured Dashboard Crash:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md shadow-2xl">
                <span className="text-5xl mb-4 block">⚠️</span>
                <h2 className="text-xl font-bold text-white mb-2">Dashboard Render Exception</h2>
                <p className="text-sm text-slate-400 mb-6">
                    A client-side error occurred while parsing the AI data payloads.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => reset()}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                    >
                        Retry Segment
                    </button>
                    <a
                        href="/dashboard"
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
                    >
                        Reset Application
                    </a>
                </div>
            </div>
        </div>
    );
}