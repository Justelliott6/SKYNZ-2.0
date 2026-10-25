import React, { useState } from 'react';
import { FiSend, FiX, FiMessageCircle } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

// Prototype: authenticated creator chat. The server owns the model, identity and permissions.
export default function LippyChat() {
  const token = useAuthStore((state) => state.token);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  async function send(event) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy || !token) return;
    setDraft('');
    setError('');
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setBusy(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Lippy is unavailable');
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply || '(No response)' }]);
    } catch (err) {
      setError(err.message || 'Unable to reach the AI server');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end" aria-label="Lippy assistant">
      {open && (
        <section className="mb-3 w-[min(370px,calc(100vw-40px))] h-[min(510px,calc(100vh-115px))] flex flex-col overflow-hidden rounded-2xl border border-purple-500/60 bg-gray-950 text-white shadow-2xl" aria-label="Chat with Lippy">
          <header className="flex items-center justify-between bg-gradient-to-r from-purple-900 to-gray-900 px-4 py-3">
            <div><strong>Lippy</strong><div className="text-xs text-gray-300">SKYNZ creator assistant · prototype</div></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Lippy chat" className="p-2 rounded hover:bg-white/10"><FiX /></button>
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm" role="log" aria-live="polite">
            {messages.length === 0 && <p className="text-gray-300">Hey there! What are we working on today?</p>}
            {messages.map((item, index) => (
              <div key={index} className={`rounded-xl p-3 whitespace-pre-wrap break-words ${item.role === 'user' ? 'bg-purple-800 ml-6' : 'bg-gray-800 mr-6'}`}>{item.text}</div>
            ))}
            {busy && <p className="text-gray-400">Lippy is thinking…</p>}
          </div>
          {error && <p role="alert" className="px-4 py-2 text-sm text-red-300">{error}. Check that the SKYNZ backend can reach its configured AI runtime.</p>}
          <form onSubmit={send} className="flex gap-2 border-t border-gray-700 p-3">
            <input aria-label="Message Lippy" maxLength={4000} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask Lippy…" className="min-w-0 flex-1 rounded-lg bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-400" />
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Send message" className="rounded-lg bg-purple-600 px-3 disabled:opacity-50"><FiSend /></button>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Hide Lippy' : 'Talk to Lippy'} aria-expanded={open} className="h-16 w-16 rounded-full border-2 border-green-400 bg-gradient-to-br from-purple-700 to-black text-white shadow-lg shadow-purple-600/50 flex items-center justify-center hover:scale-105 transition-transform" title="Talk to Lippy">
        <span aria-hidden="true" className="text-3xl">{open ? '💚' : '🤖'}</span>
      </button>
    </div>
  );
}
