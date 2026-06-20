import { useState } from 'react';
import { fetchWithAuth } from '@/utils/api';

interface CreateTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTripCreated: (newTrip: any) => void;
}

export default function CreateTripModal({ isOpen, onClose, onTripCreated }: CreateTripModalProps) {
    const [destination, setDestination] = useState('');
    const [durationDays, setDurationDays] = useState(3);
    const [budgetTier, setBudgetTier] = useState('Medium');
    const [interestsInput, setInterestsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const interests = interestsInput.split(',').map(i => i.trim()).filter(i => i !== '');

        try {
            const newTrip = await fetchWithAuth('/api/trips/generate', {
                method: 'POST',
                body: JSON.stringify({ destination, durationDays, budgetTier, interests }),
            });

            onTripCreated(newTrip);
            setDestination('');
            setInterestsInput('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to generate trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>✨</span> Generate AI Itinerary
                </h2>

                {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Destination</label>
                        <input required type="text" value={destination} onChange={e => setDestination(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none" placeholder="e.g., Tokyo, Japan" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Duration (Days)</label>
                            <input required type="number" min="1" max="14" value={durationDays} onChange={e => setDurationDays(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Budget Tier</label>
                            <select value={budgetTier} onChange={e => setBudgetTier(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none">
                                <option value="Low">Low (Backpacker)</option>
                                <option value="Medium">Medium (Standard)</option>
                                <option value="High">High (Luxury)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Interests (comma separated)</label>
                        <input required type="text" value={interestsInput} onChange={e => setInterestsInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none" placeholder="Food, History, Hiking, Photography" />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition font-bold disabled:opacity-50">
                            {loading ? 'Thinking...' : 'Generate Trip'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}