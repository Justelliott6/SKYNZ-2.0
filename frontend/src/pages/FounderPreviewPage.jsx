import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  ['Creator-owned pages', 'Design a portable creator presence. On-chain minting is not yet connected.'],
  ['Creator command center', 'Page builder, profile tools, and page analytics in one workspace.'],
  ['Streaming destinations', 'Configure planned streaming destinations; live relay is not active yet.'],
  ['Licensing and watermark', 'Planned verification utilities tied to minted assets; not active yet.'],
  ['NFC smart posters', 'Planned physical and digital links to creator experiences.'],
  ['Resale marketplace', 'Planned verified asset listings and transfers; not active yet.']
];

export default function FounderPreviewPage() {
  return <main style={{ minHeight: '100vh', background: '#10091d', color: '#f7efff', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>
    <div style={{ maxWidth: 920, margin: 'auto' }}>
      <p style={{ color: '#d4a5ff', fontWeight: 700, letterSpacing: 2 }}>SKYNZ / FOUNDER PROTOTYPE</p>
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', marginBottom: 8 }}>Your page. Your vibe. Your stage.</h1>
      <p style={{ fontSize: 18, color: '#d6c6e5', maxWidth: 680 }}>A creator-owned command center for building a presence, managing tools, and preparing distribution from one place.</p>
      <p style={{ background: '#35204b', padding: 14, borderRadius: 8 }}>Prototype preview: features below are clearly marked when they are planned rather than functional. No NFT mint, royalties, external distribution, or marketplace transfer is performed by this screen.</p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginTop: 24 }}>
        {features.map(([name, detail]) => <article key={name} style={{ background: '#221332', border: '1px solid #5a3477', borderRadius: 12, padding: 20 }}><h2 style={{ marginTop: 0 }}>{name}</h2><p style={{ color: '#d6c6e5' }}>{detail}</p></article>)}
      </section>
      <p style={{ marginTop: 32 }}><Link to="/register" style={{ display: 'inline-block', background: '#a653ed', color: '#fff', padding: '12px 18px', borderRadius: 8, marginRight: 12 }}>Try current prototype</Link><Link to="/" style={{ color: '#e7caff' }}>Back to SKYNZ</Link></p>
      <p style={{ color: '#ac99be', fontSize: 13 }}>Founder preview is not a purchase, mint, or claim of ownership.</p>
    </div>
  </main>;
}
