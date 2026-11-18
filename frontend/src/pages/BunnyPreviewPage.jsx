import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BufferingRabbit, SkynzEasterEgg, ClassicalAmbience } from '../components/SkynzDelights';

const jokes = [
  "Buffering? I'm just checking the carrot inventory.",
  "Lippy said hop. Floater said delegate. I said snacks.",
  "The page is loading. My union-mandated carrot break isn't.",
  "No rabbits were harmed in the making of this loading screen."
];
export default function BunnyPreviewPage() {
  const [joke,setJoke]=useState(0);
  return <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
    <section className="w-full max-w-lg rounded-3xl border border-emerald-500/40 bg-slate-900 p-8 text-center shadow-2xl">
      <p className="text-emerald-300 tracking-widest text-xs font-bold">SKYNZ 3.3 • BUNNY TEST DRIVE</p>
      <h1 className="text-3xl font-black mt-3">Meet the buffering bunny</h1>
      <BufferingRabbit label="Hopping through your loading screen…" />
      <p role="status" className="text-emerald-100 min-h-12">{jokes[joke]}</p>
      <button className="rounded-xl bg-emerald-400 text-slate-950 font-bold px-5 py-3 mt-4" onClick={()=>setJoke(i=>(i+1)%jokes.length)}>🐇 Another rabbit joke</button>
      <div className="mt-5"><ClassicalAmbience /></div>
      <p className="text-xs text-slate-400 mt-2">Music requires the creator-owned audio file; no audio is bundled yet.</p>
      <div className="mt-6"><SkynzEasterEgg /></div>
      <Link className="inline-block mt-6 text-cyan-300 underline" to="/">Back to SKYNZ</Link>
    </section>
  </main>;
}
