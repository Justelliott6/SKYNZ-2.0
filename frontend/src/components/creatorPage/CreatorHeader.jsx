import React from 'react';
import { FiCheck, FiExternalLink, FiShare2 } from 'react-icons/fi';

const CreatorHeader = ({ creator }) => {
  const sharePage = async () => {
    if (navigator.share) {
      await navigator.share({ title: creator.name, text: creator.bio, url: window.location.href });
    } else {
      await navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <header className="creator-header panel-shell">
      <div className="hero-image" style={creator.heroImage ? { backgroundImage: `url(${creator.heroImage})` } : undefined}>
        <span className="hero-label">Creator broadcast</span>
      </div>
      <div className="creator-header-content">
        <div className="profile-image" style={creator.profileImage ? { backgroundImage: `url(${creator.profileImage})` } : undefined} aria-label={`${creator.name} profile`}>
          {!creator.profileImage && creator.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="creator-identity">
          <div className="identity-title">
            <h1>{creator.name}</h1>
            {creator.verified && <span className="verified-badge" title="Verified creator"><FiCheck /></span>}
          </div>
          <p className="handle">@{creator.handle}</p>
          <p className="creator-bio">{creator.bio}</p>
        </div>
        <div className="header-actions">
          <button type="button" className="button button-primary">Follow <FiExternalLink /></button>
          <button type="button" className="icon-button" onClick={sharePage} title="Share creator page"><FiShare2 /></button>
        </div>
      </div>
      <div className="platform-row">
        {(creator.platforms || []).map((platform) => <span className="platform-chip" key={platform}>{platform}</span>)}
        {(!creator.platforms || creator.platforms.length === 0) && <span className="muted-copy">Social links will appear when connected.</span>}
      </div>
    </header>
  );
};

export default CreatorHeader;
