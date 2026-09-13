import React from 'react';
import { FiPlay, FiRadio } from 'react-icons/fi';

const MediaPanel = ({ media }) => (
  <section className="panel-shell media-panel">
    <div className="panel-heading"><div><span className="section-kicker">Main content</span><h2>Media room</h2></div><span className="live-pill"><FiRadio /> {media.isLive ? 'Live' : 'Replay'}</span></div>
    {media.embedUrl ? (
      <iframe className="media-frame" src={media.embedUrl} title="Creator media player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    ) : (
      <div className="media-placeholder"><FiPlay /><strong>Media player ready</strong><span>Connect an embed URL in the page builder to show creator media.</span></div>
    )}
  </section>
);

export default MediaPanel;
