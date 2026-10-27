import React, { useEffect, useState } from 'react';
import CreatorStudioShell from '../components/CreatorStudioShell';

const STORAGE_KEY = 'skynz-local-creator-page-v1';
const INITIAL = { title: 'My SKYNZ Creator Page', handle: 'my-creator-page' };

export default function StudioPreviewPage() {
  const [identity, setIdentity] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && typeof saved.title === 'string' && typeof saved.handle === 'string') {
        return { title: saved.title.slice(0, 80), handle: saved.handle.slice(0, 60) };
      }
    } catch {}
    return INITIAL;
  });

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity)); } catch {}
  }, [identity]);

  return (
    <div className="bg-black min-h-screen">
      <section aria-label="Creator page identity" className="bg-black border-b border-purple-700 px-4 py-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-gray-300" htmlFor="local-page-title">Your Creator page title</label>
            <input id="local-page-title" value={identity.title} maxLength={80}
              onChange={event => setIdentity(previous => ({ ...previous, title: event.target.value }))}
              className="block mt-2 rounded-lg border border-purple-600 bg-gray-950 p-3 text-white w-full"/>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-gray-300" htmlFor="local-page-handle">Your Creator handle (preview)</label>
            <input id="local-page-handle" value={identity.handle} maxLength={60}
              onChange={event => setIdentity(previous => ({ ...previous, handle: event.target.value }))}
              className="block mt-2 rounded-lg border border-purple-600 bg-gray-950 p-3 text-white w-full"/>
          </div>
          <p className="text-cyan-300 text-sm">Saved automatically in this browser</p>
        </div>
      </section>
      <CreatorStudioShell preview handle={identity.handle} pageTitle={identity.title} />
    </div>
  );
}
