'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';
import CreateTripModal from '@/components/CreateTripModal';

// Defining our strict TypeScript interfaces based on our Mongoose schema
interface Activity {
    _id?: string;
    title: string;
    description: string;
    estimatedCostUSD: number;
    timeOfDay: string;
}

interface ItineraryDay {
    dayNumber: number;
    activities: Activity[];
}

interface PackingItem {
    _id?: string;
    item: string;
    category: string;
    isPacked: boolean;
}

interface Trip {
    _id: string;
    destination: string;
    durationDays: number;
    budgetTier: string;
    itinerary: ItineraryDay[];
    packingList: PackingItem[];
    estimatedBudget: {
        total: number;
        accommodation: number;
        food: number;
        activities: number;
        transport: number;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // 1. Enclave Check: Kick out unauthenticated users
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // 2. Fetch User-Isolated Trips
        const loadTrips = async () => {
            try {
                const data = await fetchWithAuth('/api/trips');
                setTrips(data);
                if (data.length > 0) setSelectedTrip(data[0]);
            } catch (err) {
                console.error('Failed to load trips:', err);
                // If token is expired/invalid, clear it and force re-login
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        loadTrips();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    // Add this inside the DashboardPage component
    const togglePackingItem = async (itemId: string) => {
        if (!selectedTrip) return;

        // 1. Optimistic UI Update for instant feedback
        const updatedPackingList = selectedTrip.packingList.map(item =>
            item._id === itemId ? { ...item, isPacked: !item.isPacked } : item
        );

        const updatedTrip = { ...selectedTrip, packingList: updatedPackingList };
        setSelectedTrip(updatedTrip);

        // Update the main trips array so state stays in sync if they switch trips
        setTrips(trips.map(t => t._id === updatedTrip._id ? updatedTrip : t));

        // 2. Fire the PUT request to the backend
        try {
            await fetchWithAuth(`/api/trips/${selectedTrip._id}`, {
                method: 'PUT',
                body: JSON.stringify({ packingList: updatedPackingList }),
            });
        } catch (error) {
            console.error("Failed to update packing list:", error);
            // If it fails, we would ideally revert the state here
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <div className="animate-pulse text-indigo-400 font-bold text-xl">
                    Decrypting user enclave...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            {/* Header */}
            <header className="max-w-7xl mx-auto flex justify-between items-center border-b border-slate-800 pb-5 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        AI Travel Dashboard
                    </h1>
                    <p className="text-sm text-slate-400">Your Secure Generation Vault</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition px-4 py-2 rounded-lg text-sm font-bold"
                >
                    Sign Out
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Trip Selector */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Your Active Trips</h2>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded transition"
                            >
                                + New Trip
                            </button>
                        </div>

                        {trips.length === 0 ? (
                            <p className="text-slate-500 text-sm">No itineraries found. Create one to begin!</p>
                        ) : (
                            <div className="space-y-3">
                                {trips.map((trip) => (
                                    <button
                                        key={trip._id}
                                        onClick={() => setSelectedTrip(trip)}
                                        className={`w-full text-left p-4 rounded-xl transition ${selectedTrip?._id === trip._id
                                            ? 'bg-blue-600 border border-blue-500 text-white'
                                            : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                                            }`}
                                    >
                                        <p className="font-bold">{trip.destination}</p>
                                        <p className="text-xs opacity-80">{trip.durationDays} Days • {trip.budgetTier} Budget</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Core Budgets Display */}
                    {selectedTrip && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-lg font-bold mb-4">Estimated Budget</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Accommodations:</span>
                                    <span className="font-semibold">${selectedTrip.estimatedBudget.accommodation}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Food & Dining:</span>
                                    <span className="font-semibold">${selectedTrip.estimatedBudget.food}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Activities:</span>
                                    <span className="font-semibold">${selectedTrip.estimatedBudget.activities}</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-slate-800 pt-3 text-white font-bold">
                                    <span>Grand Total:</span>
                                    <span className="text-emerald-400">${selectedTrip.estimatedBudget.total}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Itinerary Board & AI Packing List */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedTrip ? (
                        <>
                            {/* Timeline */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-800 pb-3">
                                    Day-by-Day Timeline: {selectedTrip.destination}
                                </h2>

                                <div className="space-y-6">
                                    {selectedTrip.itinerary.map((day) => (
                                        <div key={day.dayNumber} className="border-l-2 border-indigo-500 pl-6 relative">
                                            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-900" />
                                            <h3 className="text-lg font-bold text-slate-200 mb-3">Day {day.dayNumber}</h3>
                                            <div className="space-y-3">
                                                {day.activities.map((act, index) => (
                                                    <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition">
                                                        <div className="flex justify-between items-start">
                                                            <span className="font-semibold text-white">{act.title}</span>
                                                            <span className="text-xs bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                                                                {act.timeOfDay}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-400 mt-2">{act.description}</p>
                                                        {act.estimatedCostUSD > 0 && (
                                                            <p className="text-xs text-emerald-400 mt-2 font-mono">Est. Cost: ${act.estimatedCostUSD}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Creative Feature: Weather-Aware Packing Checklist */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xl font-bold mb-1 text-white flex items-center gap-2">
                                    <span>⛈️</span> AI Weather-Aware Packing Assistant
                                </h3>
                                <p className="text-sm text-slate-400 mb-6">
                                    Checklist customized for {selectedTrip.destination}'s climate and your activities.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Replace the existing packing item map with this: */}
                                    {selectedTrip.packingList?.map((item) => (
                                        <div
                                            key={item._id}
                                            onClick={() => togglePackingItem(item._id as string)}
                                            className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-700 transition"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={item.isPacked}
                                                readOnly
                                                className="h-4 w-4 rounded bg-slate-950 border-slate-800 accent-emerald-500 cursor-pointer pointer-events-none"
                                            />
                                            <span className={`text-sm ${item.isPacked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                                {item.item}
                                            </span>
                                            <span className="ml-auto text-[10px] uppercase bg-slate-950 text-slate-400 px-2 py-0.5 rounded font-mono">
                                                {item.category}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full min-h-[400px] bg-slate-900 border border-slate-800 rounded-2xl border-dashed">
                            <span className="text-6xl mb-4">✈️</span>
                            <p className="text-slate-400">Select an existing itinerary or generate a new trip.</p>
                        </div>
                    )}
                </div>
            </main>
            <CreateTripModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTripCreated={(newTrip) => {
                    setTrips([newTrip, ...trips]); // Add to the top of the list
                    setSelectedTrip(newTrip);      // Auto-select the newly generated trip
                }}
            />
        </div>
    );
}