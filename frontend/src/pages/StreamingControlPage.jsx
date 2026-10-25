import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

const API = process.env.REACT_APP_API_URL;
export default function StreamingControlPage() {
  const { token } = useAuthStore();
  const [destinations, setDestinations] = useState({});
  const [selected, setSelected] = useState([]);
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const headers = { Authorization: 'Bearer ' + token };
  const refresh = async () => {
    try {
      const [providers, state] = await Promise.all([
        fetch(API + '/api/streaming/destinations', { headers }),
        fetch(API + '/api/streaming/session', { headers })
      ]);
      if (!providers.ok || !state.ok) throw new Error('Streaming configuration unavailable');
      setDestinations(await providers.json());
      const current = await state.json();
      setSession(current);
      setSelected(current.destinations || []);
      setError('');
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { refresh(); }, [token]);
  const save = async () => {
    try {
      const response = await fetch(API + '/api/streaming/session', {
        method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinations: selected })
      });
      if (!response.ok) throw new Error('Could not save destinations');
      await refresh();
    } catch (e) { setError(e.message); }
  };
  return <main className="min-h-screen bg-black text-white p-8 space-y-6">
    <h1 className="text-3xl font-bold text-purple-300">SKYNZ Streaming Control</h1>
    <p className="text-gray-300">Choose future OBS streaming destinations. This is configuration only; no relay or live API connection is active yet.</p>
    <section className="space-y-3">
      {Object.entries(destinations).map(([id, provider]) =>
        <label key={id} className="block bg-purple-900/30 rounded-lg p-3">
          <input type="checkbox" checked={selected.includes(id)}
            onChange={e => setSelected(old => e.target.checked ? [...old, id] : old.filter(x => x !== id))} />
          <span className="ml-3">{provider.label} ({provider.protocol})</span>
        </label>
      )}
      <button onClick={save} className="bg-purple-700 px-5 py-3 rounded-lg">Save destinations</button>
      <button onClick={refresh} className="bg-gray-700 px-5 py-3 rounded-lg ml-3">Refresh status</button>
    </section>
    {error && <p role="alert" className="text-red-300">{error}</p>}
    {session && <section className="bg-purple-900/20 rounded-lg p-5 space-y-2">
      <h2 className="font-bold text-xl">Stream status: {session.status}</h2>
      <p>Viewer counts: unavailable until provider integrations are connected.</p>
      <p>Selected: {(session.destinations || []).join(', ') || 'None'}</p>
    </section>}
  </main>;
}
