import React from 'react';
import themePresets from '../theme/themePresets';

const colorControls = [
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['accent', 'Accent'],
  ['background', 'Background']
];

const AIDesigner = ({ theme, creator, onThemeChange, onCreatorChange }) => (
  <aside className="ai-designer" aria-label="Local AI Designer preview controls">
    <div className="section-kicker">Local preview</div>
    <h2>AI Designer</h2>
    <p className="designer-note">Theme controls are local only. No external AI API is connected.</p>

    <label className="control-label" htmlFor="theme-preset">Theme preset</label>
    <select id="theme-preset" value={creator.preset || 'SKYNZ Neon'} onChange={(event) => onCreatorChange({ preset: event.target.value })}>
      {Object.keys(themePresets).map((preset) => <option key={preset}>{preset}</option>)}
    </select>

    <div className="color-grid">
      {colorControls.map(([key, label]) => (
        <label className="color-control" key={key}>
          <span>{label}</span>
          <input type="color" value={theme[key]} onChange={(event) => onThemeChange({ [key]: event.target.value })} />
        </label>
      ))}
    </div>

    <label className="control-label" htmlFor="genre">Genre</label>
    <select id="genre" value={creator.genre} onChange={(event) => onCreatorChange({ genre: event.target.value })}>
      {['Creator', 'Southern Rock', 'Country', 'Metal', 'Hip Hop', 'Electronic', 'Podcast'].map((genre) => <option key={genre}>{genre}</option>)}
    </select>

    <label className="control-label" htmlFor="vibe">Vibe / style</label>
    <select id="vibe" value={creator.vibe} onChange={(event) => onCreatorChange({ vibe: event.target.value })}>
      {['Open channel', 'Electric', 'Warm', 'Raw', 'Minimal', 'Late night', 'Live room'].map((vibe) => <option key={vibe}>{vibe}</option>)}
    </select>

    <label className="range-control" htmlFor="radius">
      <span>Border radius</span>
      <output>{theme.borderRadius}px</output>
      <input id="radius" type="range" min="0" max="28" value={theme.borderRadius} onChange={(event) => onThemeChange({ borderRadius: Number(event.target.value) })} />
    </label>

    <label className="toggle-control">
      <input type="checkbox" checked={theme.glow} onChange={(event) => onThemeChange({ glow: event.target.checked })} />
      <span>Glow effects</span>
    </label>
  </aside>
);

export default AIDesigner;
