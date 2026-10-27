import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MusicLoopMaker from './MusicLoopMaker';
import VideoVisualizer from './VideoVisualizer';
import ShieldDesk from './ShieldDesk';
import FloaterDesk from './FloaterDesk';

const PANELS = [
  { id: 'music', name: 'Music Generator', icon: '🎵', subtitle: 'Beats and WAV' },
  { id: 'video', name: 'Video Studio', icon: '🎬', subtitle: 'Visuals and WebM' },
  { id: 'shield', name: 'FMG Shield', icon: '🛡️', subtitle: 'Local AI chat' },
  { id: 'floater', name: 'Floater Agent', icon: '🤖', subtitle: 'Agent operations' }
];

export default function CreatorStudioShell({ handle = '', preview = false }) {
  const [active, setActive] = useState('music');
  const panel = PANELS.find(item => item.id === active) || PANELS[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-[#1a0b2f] to-black text-white px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="rounded-2xl border border-purple-500/40 bg-black/50 px-6 py-7 md:px-9 mb-7">
          <div className="flex flex-wrap gap-5 justify-between items-start">
            <div>
              <p className="text-purple-300 uppercase tracking-[.3em] text-xs font-bold mb-3">SKYNZ Creator Studio</p>
              <h1 className="font-black text-4xl md:text-6xl tracking-tight leading-tight">
                <span className="text-white">SKY</span><span className="text-fuchsia-400">NZ</span>
                <span className="block text-lg md:text-2xl font-medium text-gray-200 tracking-normal mt-3">Your page. Your vibe. Your stage.</span>
              </h1>
              <p className="mt-4 text-gray-400 max-w-2xl">Designed for the future. Built to run today.</p>
              <p className="mt-2 text-cyan-300 text-sm">
                {preview ? 'Local development preview · No account or database required for music/video tools'
                  : 'Private creator workspace · @' + handle}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/dashboard" className="px-4 py-3 rounded-lg border border-gray-600 text-gray-200 hover:text-white">Dashboard</Link>
              {!preview && handle && (
                <Link to={'/creator/' + encodeURIComponent(handle)}
                  className="px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 font-semibold">
                  Public page
                </Link>
              )}
            </div>
          </div>
        </header>

        <div role="tablist" aria-label="Creator tools" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {PANELS.map(item => (
            <button type="button" role="tab" key={item.id} id={'studio-tab-' + item.id}
              aria-selected={active === item.id} aria-controls="studio-panel"
              onClick={() => setActive(item.id)}
              className={'text-left rounded-xl border p-4 md:p-5 transition ' +
                (active === item.id ? 'bg-purple-800/70 border-fuchsia-400 shadow-lg shadow-fuchsia-900/25'
                  : 'bg-black/60 border-purple-500/25 hover:border-purple-400')}>
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <span className="block font-bold mt-2 text-base md:text-lg">{item.name}</span>
              <span className="block text-xs md:text-sm text-gray-300 mt-1">{item.subtitle}</span>
            </button>
          ))}
        </div>

        <section id="studio-panel" role="tabpanel" aria-labelledby={'studio-tab-' + active}
          className="rounded-2xl border border-purple-500/40 bg-gradient-to-b from-[#1c1130] to-[#0a0a10] px-4 py-6 md:p-8">
          <div className="mb-6 border-b border-purple-500/30 pb-5">
            <h2 className="text-2xl md:text-3xl font-bold">{panel.icon} {panel.name}</h2>
            <p className="text-gray-400 mt-2">
              {active === 'music' ? 'Generate and edit a drum-and-bass loop, then take the WAV into your other music tools.' :
               active === 'video' ? 'Turn a song and optional image into a music visualizer video.' :
               active === 'shield' ? 'Swap local AI models without changing the Creator Studio.' :
               'Check your locally running Floater and continue approved agent work.'}
            </p>
          </div>
          {/* Keep every tool mounted only while selected. No tool shares mutable state with the others. */}
          {active === 'music' && <MusicLoopMaker />}
          {active === 'video' && <VideoVisualizer />}
          {active === 'shield' && <ShieldDesk preview={preview} />}
          {active === 'floater' && <FloaterDesk preview={preview} />}
        </section>

        <footer className="mt-7 text-gray-500 text-xs text-center">
          SKYNZ 2.0 · Proof-of-concept Creator Studio · Local browser generation, private services, and replaceable components
        </footer>
      </div>
    </main>
  );
}
