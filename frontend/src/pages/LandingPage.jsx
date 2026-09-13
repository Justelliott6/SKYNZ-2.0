import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleEnter = () => navigate('/login');
  const handleCreate = () => navigate('/register');

  const stats = [
    { label: 'Creators', value: '12k+' },
    { label: 'Live rooms', value: '348' },
    { label: 'Engagement', value: '94%' }
  ];

  const platforms = ['YouTube', 'Spotify', 'Twitch', 'Instagram', 'TikTok', 'Discord'];

  return (
    <div className="skynz-landing-page">
      <div className="landing-backdrop" aria-hidden="true" />

      <header className="landing-topbar">
        <div className="brand-mark" aria-label="SKYNZ logo">
          <span className="brand-mark__shape" />
          <span className="brand-mark__word">SKYNZ</span>
        </div>

        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#platforms">Platforms</a>
          <a href="#creator">Creator</a>
        </nav>

        <div className="landing-actions">
          <button className="button button-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="button button-primary" onClick={handleCreate}>Create Page</button>
        </div>
      </header>

      <main className="landing-shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <div className="eyebrow">Your page. Your vibe. Your stage.</div>
            <h1>Build a creator home for every stream, song, post, and fan moment.</h1>
            <p>
              SKYNZ brings your content, community, merch, live chats, and audience analytics into one creator command page.
            </p>

            <div className="hero-actions">
              <button className="button button-primary" onClick={handleEnter}>Enter SKYNZ</button>
              <button className="button button-secondary" onClick={handleCreate}>Start Your Page</button>
            </div>

            <div className="stat-row">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-box">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="logo-embed" aria-label="SKYNZ.com logo embed">
            <div className="logo-card">
              <div className="logo-card__glow" aria-hidden="true" />
              <div className="logo-card__mark">
                <span className="logo-card__shape" />
              </div>
              <div className="logo-card__word">SKYNZ</div>
              <div className="logo-card__tag">creator command page</div>
            </div>
          </div>
        </section>

        <section id="features" className="feature-grid">
          <article className="feature-card">
            <span>01</span>
            <h3>Unified creator page</h3>
            <p>Keep your artist identity, media, links, and audience engagement in one place.</p>
          </article>
          <article className="feature-card">
            <span>02</span>
            <h3>Live fan connection</h3>
            <p>Chat, stream, support, and broadcast updates without bouncing between platforms.</p>
          </article>
          <article className="feature-card">
            <span>03</span>
            <h3>Data that matters</h3>
            <p>Track views, audience activity, watch time, and growth from the page dashboard.</p>
          </article>
        </section>

        <section id="platforms" className="platform-strip">
          {platforms.map((platform) => (
            <div key={platform} className="platform-pill">{platform}</div>
          ))}
        </section>

        <section id="creator" className="creator-note">
          <div>
            <div className="eyebrow">Built for creators</div>
            <h2>Power your next release, stream, or launch from one optimized home.</h2>
          </div>
          <button className="button button-primary" onClick={handleCreate}>Launch Your Space</button>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
