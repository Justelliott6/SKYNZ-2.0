import React, { useEffect, useState } from 'react';
import { API_URL } from '../config/api';
import useAuthStore from '../store/authStore';

export default function ShieldDesk({ preview = false }) {
  const { token } = useAuthStore();
  const [models, setModels] = useState([]);
  const [model, setModel] = useState('');
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('Checking local models...');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    if (!token || preview) {
      setStatus('Sign in to a private Creator page to connect the local AI.');
      return;
    }
    setStatus('Looking for Ollama...');
    try {
      const response = await fetch(API_URL + '/api/studio/models', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load models');
      setModels(data.models || []);
      setModel(previous => (data.models || []).some(item => item.name === previous)
        ? previous : data.models?.[0]?.name || '');
      setStatus(data.models?.length ? 'Local Ollama model ready' : 'Ollama is running, but no models are installed.');
    } catch (error) { setStatus(error.message); }
  };

  useEffect(() => { refresh(); }, [token, preview]);

  const send = async event => {
    event.preventDefault();
    if (!model || !prompt.trim() || busy) return;
    const next = [...messages.slice(-18).map(message => ({ ...message, content: message.content.slice(0, 4000) })), { role: 'user', content: prompt.trim().slice(0, 4000) }];
    setMessages(next);
    setPrompt('');
    setBusy(true); setStatus('Local model is thinking...');
    try {
      const response = await fetch(API_URL + '/api/studio/chat', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: next })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Model request failed');
      setMessages(previous => [...previous, { role: 'assistant', content: data.answer }]);
      setStatus('Ready');
    } catch (error) { setStatus(error.message); }
    finally { setBusy(false); }
  };

  return (
    <section aria-label="FMG Shield AI desk" className="space-y-4">
      <p className="text-gray-300">Chat with a replaceable model running through Ollama on the same PC as SKYNZ.</p>
      <div className="flex flex-wrap gap-3 items-end">
        <label className="text-sm text-gray-200 flex-1 min-w-[190px]">Local AI model
          <select value={model} onChange={event => setModel(event.target.value)}
            className="block mt-2 w-full rounded-lg bg-black border border-purple-500 p-3 text-white">
            {models.length === 0 && <option value="">No local model connected</option>}
            {models.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <button type="button" onClick={refresh} className="rounded-lg bg-gray-800 text-white px-5 py-3">Refresh models</button>
        <button type="button" onClick={() => { setMessages([]); setStatus('Chat cleared from this browser session'); }}
          className="rounded-lg bg-gray-800 text-white px-5 py-3">New chat</button>
      </div>
      <p role="status" className="text-cyan-300 text-sm">{status}</p>
      <div className="rounded-xl bg-black/50 border border-purple-500/30 min-h-[230px] max-h-[360px] overflow-y-auto p-4 space-y-3">
        {messages.length === 0
          ? <p className="text-gray-400">This is your private local-model chat workspace. Select a model, then ask a question.</p>
          : messages.map((message, index) => (
            <div key={index} className={'max-w-[94%] rounded-xl px-4 py-3 whitespace-pre-wrap text-sm ' +
              (message.role === 'user' ? 'ml-auto bg-purple-800 text-white' : 'mr-auto bg-gray-800 text-gray-100')}>
              <strong className="block mb-1">{message.role === 'user' ? 'You' : model}</strong>
              {message.content}
            </div>
          ))}
      </div>
      <form onSubmit={send} className="flex flex-col sm:flex-row gap-3">
        <input value={prompt} onChange={event => setPrompt(event.target.value)}
          maxLength={4000} aria-label="Message for the local AI" placeholder="Ask your assistant..."
          className="flex-1 min-w-0 rounded-lg bg-black border border-purple-500 px-4 py-3 text-white" />
        <button type="submit" disabled={!model || !prompt.trim() || busy || preview}
          className="rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white px-6 py-3 font-semibold">Send</button>
      </form>
      <p className="text-gray-400 text-sm">
        Live model chat is available when authenticated and Ollama is installed. Chat is held in the page session; the separate FMG Shield governance and long-term memory modules are not yet wired in.
      </p>
    </section>
  );
}
