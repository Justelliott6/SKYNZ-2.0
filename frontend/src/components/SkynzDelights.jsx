import React, { useEffect, useState } from 'react';

/** Decorative, reduced-motion-aware loading rabbit. No external assets required. */
export function BufferingRabbit({ label = 'Building your SKYNZ page…' }) {
  return <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-6 text-slate-300">
    <svg viewBox="0 0 120 120" width="94" height="94" aria-hidden="true" className="skynz-rabbit-hop">
      <ellipse cx="44" cy="30" rx="12" ry="29" fill="#b7f7d9" transform="rotate(-15 44 30)"/>
      <ellipse cx="75" cy="30" rx="12" ry="29" fill="#b7f7d9" transform="rotate(15 75 30)"/>
      <ellipse cx="44" cy="30" rx="5" ry="20" fill="#ef9cb1" transform="rotate(-15 44 30)"/>
      <ellipse cx="75" cy="30" rx="5" ry="20" fill="#ef9cb1" transform="rotate(15 75 30)"/>
      <circle cx="60" cy="74" r="39" fill="#b7f7d9"/>
      <circle cx="47" cy="69" r="4" fill="#182c2a"/><circle cx="73" cy="69" r="4" fill="#182c2a"/>
      <path d="M56 83 Q60 88 64 83 M60 86 v6 M53 93 Q60 99 67 93" fill="none" stroke="#182c2a" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="60" cy="83" rx="5" ry="3" fill="#ef9cb1"/>
    </svg>
    <span className="text-sm font-semibold">{label}</span>
    <style>{`@keyframes skynzHop { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-9px)} } .skynz-rabbit-hop {animation:skynzHop 1.25s ease-in-out infinite} @media(prefers-reduced-motion:reduce){.skynz-rabbit-hop{animation:none}}`}</style>
  </div>;
}

/** Easter egg: five clicks on the SKYNZ wordmark reveal a harmless surprise. */
export function SkynzEasterEgg() {
  const [count,setCount]=useState(0);
  const [revealed,setRevealed]=useState(false);
  useEffect(()=>{ if(!revealed) return; const id=setTimeout(()=>setRevealed(false),6500);return ()=>clearTimeout(id); },[revealed]);
  return <div className="text-center">
    <button type="button" onClick={()=>{if(count>=4){setRevealed(true);setCount(0)}else setCount(n=>n+1)}} className="text-xs tracking-[.25em] font-bold text-emerald-300 hover:text-white" aria-label="SKYNZ surprise">SKYNZ ✦</button>
    {revealed && <p role="status" className="mt-2 text-sm text-emerald-200">🐇 You found the rabbit hole. Your page. Your vibe. Your stage.</p>}
  </div>;
}

/** Music only plays when a creator explicitly opts in. */
export function ClassicalAmbience({ src = '/audio/skynz-classical.mp3' }) {
  const [enabled,setEnabled]=useState(false);
  const [failed,setFailed]=useState(false);
  return <div className="text-xs text-slate-400">
    <audio src={src} loop preload="none" onError={()=>{setFailed(true);setEnabled(false)}} ref={node=>{if(!node)return;if(enabled){node.volume=0.18;node.play().catch(()=>{setEnabled(false);setFailed(true)})}else node.pause()}} />
    <button type="button" onClick={()=>{setFailed(false);setEnabled(v=>!v)}} aria-pressed={enabled} className="rounded-full border border-slate-700 px-3 py-2">{enabled?'♫ Music on · turn off':'♫ Classical ambience · play'}</button>
    {failed && <span className="ml-2">Music file not installed yet.</span>}
  </div>;
}
