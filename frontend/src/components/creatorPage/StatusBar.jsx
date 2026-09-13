import React from 'react';
import { FiActivity, FiHeadphones, FiRadio, FiUsers } from 'react-icons/fi';

const StatusBar = ({ media, creator }) => (
  <section className="status-row" aria-label="Creator status">
    <div className="status-item"><span className="status-icon"><FiActivity /></span><span><small>Genre / vibe</small><strong>{creator.genre} / {creator.vibe}</strong></span></div>
    <div className="status-item"><span className="status-icon"><FiHeadphones /></span><span><small>Now playing</small><strong>{media.nowPlaying}</strong></span></div>
    <div className="status-item"><span className="status-icon"><FiUsers /></span><span><small>Listeners / viewers</small><strong>{media.listeners}</strong></span></div>
    <div className="status-item"><span className={`live-dot ${media.isLive ? 'is-live' : ''}`}><FiRadio /></span><span><small>Status</small><strong>{media.isLive ? 'Live now' : 'Offline / replay'}</strong></span></div>
  </section>
);

export default StatusBar;
