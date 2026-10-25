import React from 'react';

// Explicitly supported media providers only. Never iframe arbitrary user URLs.
export function embedFor(provider, value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    if (provider === 'youtube') {
      let id = '';
      if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
      if (host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com') {
        id = url.searchParams.get('v') || (url.pathname.startsWith('/embed/') ? url.pathname.split('/')[2] : '');
      }
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? 'https://www.youtube-nocookie.com/embed/' + id : null;
    }
    if (provider === 'spotify' && (host === 'open.spotify.com')) {
      const parts = url.pathname.split('/').filter(Boolean);
      const typeIndex = parts[0]?.startsWith('intl-') ? 1 : 0;
      const type = parts[typeIndex], id = parts[typeIndex + 1];
      if (['track', 'album', 'playlist', 'artist', 'episode', 'show'].includes(type) && /^[a-zA-Z0-9]{22}$/.test(id || '')) {
        return 'https://open.spotify.com/embed/' + type + '/' + id;
      }
    }
  } catch (_) { return null; }
  return null;
}

export default function MediaWidgets({ page }) {
  const widgets = (Array.isArray(page.widgets) ? page.widgets : []).slice(0, 12);
  return (
    <div className="space-y-4">
      {widgets.map((widget, index) => {
        if (!widget || !['youtube', 'spotify', 'link'].includes(widget.type)) return null;
        const embed = embedFor(widget.type, widget.url);
        const label = widget.title || widget.type;
        return (
          <section key={index} className="bg-black/50 border border-purple-500/30 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">{label}</h3>
            {embed ? <iframe title={label} src={embed} className="w-full rounded-lg" height={widget.type === 'spotify' ? 220 : 360}
              allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /> :
              widget.type === 'link' && /^https:\/\//i.test(widget.url || '') ?
                <a href={widget.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Open {label}</a> :
                <p className="text-gray-400 text-sm">Add a supported {widget.type} URL in the editor.</p>}
          </section>
        );
      })}
    </div>
  );
}
