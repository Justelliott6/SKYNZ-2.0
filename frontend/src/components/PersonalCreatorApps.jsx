import React from 'react';

const apps = [
  { id: 'music', title: 'Music Generation', description: 'Create and develop songs.', icon: '🎵', url: process.env.REACT_APP_MUSIC_APP_URL },
  { id: 'video', title: 'Velorn Music Video Studio', description: 'Edit music videos and explore AI-assisted visuals.', icon: '🎬', url: process.env.REACT_APP_VELORN_APP_URL },
  { id: 'shield', title: 'FMG Shield', description: 'Open your personal AI desk.', icon: '🛡️', url: process.env.REACT_APP_FMG_SHIELD_URL }
];

export default function PersonalCreatorApps({ isOwner = false }) {
  if (!isOwner) return null;
  return (
    <section aria-label="My creator apps" className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
      <h2 className="text-white text-xl font-bold mb-4">My Creator Apps</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {apps.map(app => (
          <div key={app.id} className="bg-black/60 border border-purple-500/30 rounded-lg p-4">
            <div className="text-3xl mb-2" aria-hidden="true">{app.icon}</div>
            <h3 className="text-white font-semibold">{app.title}</h3>
            <p className="text-gray-400 text-sm my-2">{app.description}</p>
            {app.url ? (
              <a href={app.url} target="_blank" rel="noopener noreferrer" className="inline-block rounded bg-purple-600 hover:bg-purple-700 px-4 py-2 text-white text-sm">Open app</a>
            ) : (
              <span className="text-amber-300 text-sm">Not connected yet</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs mt-4">Local desktop apps require a separately configured launcher. These links do not install or start local software.</p>
    </section>
  );
}
