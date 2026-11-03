import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const PLATFORMS = [
  ['youtube', 'YouTube', '▶'], ['spotify', 'Spotify', '♫'], ['twitch', 'Twitch', '▣'],
  ['instagram', 'Instagram', '◎'], ['tiktok', 'TikTok', '♪'], ['discord', 'Discord', '◉'],
  ['patreon', 'Patreon', '♥'], ['twitter', 'X', '𝕏'], ['facebook', 'Facebook', 'f'],
  ['soundcloud', 'SoundCloud', '☁'], ['website', 'Website', '↗']
];
const EMPTY = { title: '', handle: '', description: '', platforms: [], social_links: {}, embed_url: '', affiliate_link: '' };
const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20';
const safeUrl = (value) => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
  catch { return ''; }
};
const embedUrl = (value) => {
  const safe = safeUrl(value);
  if (!safe) return '';
  try {
    const url = new URL(safe);
    if (url.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(url.pathname.slice(1))}`;
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname) && url.pathname === '/watch') {
      const id = url.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : '';
    }
    if (['youtube.com', 'www.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname) && url.pathname.startsWith('/embed/')) return safe;
    if (url.hostname === 'open.spotify.com' && /^\/(track|playlist|album|episode)\//.test(url.pathname)) return `https://open.spotify.com/embed${url.pathname}`;
  } catch { return ''; }
  return '';
};

function Label({ children, htmlFor }) { return <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-slate-200">{children}</label>; }

export default function PageBuilderPage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [draft, setDraft] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(pageId));
  const [saving, setSaving] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [proposal, setProposal] = useState(null);
  const [tab, setTab] = useState('page');
  const [aiStatus, setAiStatus] = useState('');
  const [accent, setAccent] = useState('#39d99a');

  useEffect(() => {
    if (!pageId) return undefined;
    let active = true;
    (async () => {
      try {
        const response = await fetch(`${API}/api/pages/id/${encodeURIComponent(pageId)}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error('Could not load this page.');
        const page = await response.json();
        if (active) setDraft({ ...EMPTY, ...page, platforms: Array.isArray(page.platforms) ? page.platforms : [], social_links: page.social_links || {} });
      } catch (error) { if (active) toast.error(error.message); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [pageId, token]);

  const setField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const previewEmbed = useMemo(() => embedUrl(draft.embed_url), [draft.embed_url]);

  const generateDraft = async (event) => {
    event.preventDefault();
    if (!instruction.trim()) return;
    setThinking(true); setProposal(null); setAiStatus('');
    try {
      const response = await fetch(`${API}/api/ai/page-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ instruction: instruction.trim(), currentDraft: draft })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'The page assistant is unavailable.');
      setProposal(body);
      setAiStatus(`${body.provider || 'AI'}${body.model ? ` · ${body.model}` : ''}`);
    } catch (error) { toast.error(error.message); }
    finally { setThinking(false); }
  };

  const applyProposal = () => {
    if (!proposal?.page) return;
    setDraft((current) => ({ ...current, ...proposal.page }));
    setProposal(null);
    toast.success('Draft updated. Review it in the preview before saving.');
  };

  const savePage = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      const cleanHandle = draft.handle.trim().toLowerCase().replace(/^@/, '');
      const response = await fetch(`${API}/api/pages${pageId ? `/${encodeURIComponent(pageId)}` : ''}`, {
        method: pageId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...draft, handle: cleanHandle })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not save your creator page.');
      toast.success(pageId ? 'Creator page updated.' : 'Creator page created.');
      navigate('/dashboard');
    } catch (error) { toast.error(error.message); }
    finally { setSaving(false); }
  };

  const togglePlatform = (id) => setDraft((current) => ({
    ...current,
    platforms: current.platforms.includes(id) ? current.platforms.filter((item) => item !== id) : [...current.platforms, id]
  }));

  if (loading) return <main className="min-h-screen bg-[#080e14] p-10 text-white">Loading your creator page…</main>;

  return (
    <main className="min-h-screen bg-[#080e14] px-4 py-7 text-white md:px-8">
      <div className="mx-auto max-w-[1480px]">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-[.25em] text-emerald-300">SKYNZ / CREATOR STUDIO</div>
            <h1 className="mt-2 text-3xl font-bold">{pageId ? 'Edit your creator page' : 'Build your creator page'}</h1>
            <p className="mt-1 text-slate-400">Tell your story, add your links, and shape the page before it goes live.</p>
          </div>
          <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">Preview first · You choose what gets saved</div>
        </header>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-[#10232b] to-[#101923] p-5 shadow-xl shadow-cyan-950/10 md:p-6" aria-labelledby="assistant-title">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold tracking-[.2em] text-cyan-200">PAGE BUILDING AGENT</div>
                  <h2 id="assistant-title" className="mt-1 text-xl font-bold">Describe the page you want</h2>
                  <p className="mt-1 max-w-2xl text-sm text-slate-400">The connected assistant drafts page text and supported links. It cannot publish or save for you.</p>
                </div>
                <span className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">{aiStatus || 'Ollama connection'}</span>
              </div>
              <form onSubmit={generateDraft}>
                <Label htmlFor="ai-instruction">Your instructions</Label>
                <textarea id="ai-instruction" rows={3} maxLength={2000} className={inputClass} value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="Example: Make an artist page for my Southern rock music. Use a warm, direct bio and include Spotify and YouTube." />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">Suggestions stay in this draft until you apply them.</span>
                  <button type="submit" disabled={thinking || !instruction.trim()} className="rounded-xl bg-cyan-300 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">{thinking ? 'Building draft…' : 'Build a draft'}</button>
                </div>
              </form>
              {proposal && <div className="mt-5 rounded-xl border border-cyan-300/30 bg-slate-950/60 p-4">
                <div className="text-sm font-semibold text-cyan-100">Suggested changes</div>
                <p className="mt-1 text-sm text-slate-300">{proposal.explanation || 'Review the suggested fields below before applying.'}</p>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div><span className="text-slate-500">Title</span><div className="break-words">{proposal.page?.title || '—'}</div></div>
                  <div><span className="text-slate-500">Handle</span><div className="break-words">@{proposal.page?.handle || '—'}</div></div>
                  <div className="sm:col-span-2"><span className="text-slate-500">About</span><div className="whitespace-pre-wrap">{proposal.page?.description || '—'}</div></div>
                  <div className="sm:col-span-2"><span className="text-slate-500">Platforms</span><div>{(proposal.page?.platforms || []).join(', ') || 'None selected'}</div></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={applyProposal} className="rounded-lg bg-emerald-300 px-4 py-2 font-bold text-slate-950">Apply to draft</button>
                  <button type="button" onClick={() => setProposal(null)} className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200">Discard</button>
                </div>
              </div>}
            </section>

            <form onSubmit={savePage} className="rounded-2xl border border-slate-800 bg-[#101923] p-5 md:p-7">
              <nav className="mb-6 flex flex-wrap gap-2" aria-label="Creator page sections">
                {['page', 'media', 'platforms', 'design'].map((key) => <button type="button" key={key} onClick={() => setTab(key)} aria-pressed={tab === key} className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${tab === key ? 'bg-emerald-300 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{key}</button>)}
              </nav>
              {tab === 'page' && <section>
                <div className="mb-5"><Label htmlFor="title">Page title</Label><input id="title" required maxLength={120} className={inputClass} value={draft.title} onChange={(event) => setField('title', event.target.value)} placeholder="Your artist or creator name" /></div>
                <div className="mb-5"><Label htmlFor="handle">Creator handle</Label><div className="flex items-center gap-2"><span className="text-slate-400">@</span><input id="handle" required pattern="[a-zA-Z0-9_-]+" maxLength={50} className={inputClass} value={draft.handle} onChange={(event) => setField('handle', event.target.value)} placeholder="yourname" /></div></div>
                <div className="mb-5"><Label htmlFor="description">About your page</Label><textarea id="description" rows={5} maxLength={1500} className={inputClass} value={draft.description || ''} onChange={(event) => setField('description', event.target.value)} placeholder="Tell visitors what you create" /></div>
                <div><Label htmlFor="affiliate">Support link</Label><input id="affiliate" type="url" maxLength={500} className={inputClass} value={draft.affiliate_link || ''} onChange={(event) => setField('affiliate_link', event.target.value)} placeholder="https://…" /></div>
              </section>}
              {tab === 'media' && <section>
                <p className="mb-4 text-sm text-slate-400">Paste a Spotify track, album, or playlist link, or a YouTube video link. Supported links show in the preview.</p>
                <Label htmlFor="embed">Spotify or YouTube URL</Label><input id="embed" type="url" maxLength={500} className={inputClass} value={draft.embed_url || ''} onChange={(event) => setField('embed_url', event.target.value)} placeholder="https://open.spotify.com/playlist/…" />
                {draft.embed_url && !previewEmbed && <p className="mt-2 text-sm text-amber-300">That link is saved as text, but this preview only embeds Spotify and YouTube.</p>}
              </section>}
              {tab === 'platforms' && <section>
                <p className="mb-4 text-sm text-slate-400">Choose services and add the public profile URL for each. Only links you provide become clickable.</p>
                <div className="space-y-3">{PLATFORMS.map(([id, name, icon]) => <div key={id} className={`rounded-xl border p-4 transition ${draft.platforms.includes(id) ? 'border-emerald-300/60 bg-emerald-300/5' : 'border-slate-700 bg-slate-950'}`}>
                  <label className="flex cursor-pointer items-center gap-3"><input type="checkbox" checked={draft.platforms.includes(id)} onChange={() => togglePlatform(id)} className="h-4 w-4 accent-emerald-300"/><span className="text-lg" aria-hidden="true">{icon}</span><span className="font-semibold">{name}</span></label>
                  {draft.platforms.includes(id) && <input type="url" aria-label={`${name} profile URL`} maxLength={500} className={`${inputClass} mt-3`} value={draft.social_links?.[id] || ''} onChange={(event) => setDraft((current) => ({ ...current, social_links: { ...(current.social_links || {}), [id]: event.target.value } }))} placeholder={`https://${id}.com/your-profile`} />}
                </div>)}</div>
              </section>}
              {tab === 'design' && <section>
                <Label htmlFor="accent">Accent color</Label><div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-950 p-4"><input id="accent" type="color" value={accent} onChange={(event) => setAccent(event.target.value)} className="h-12 w-16 cursor-pointer rounded border-0 bg-transparent"/><span className="text-sm text-slate-300">Use this color to preview your page highlight.</span></div>
                <p className="mt-4 text-sm text-slate-500">Color is a preview setting in this prototype; page color is not saved yet.</p>
              </section>}
              <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-800 pt-5"><button type="submit" disabled={saving} className="rounded-xl px-6 py-3 font-bold text-slate-950 disabled:opacity-50" style={{ backgroundColor: accent }}>{saving ? 'Saving…' : pageId ? 'Save changes' : 'Create page'}</button><button type="button" onClick={() => navigate('/dashboard')} className="rounded-xl border border-slate-600 px-5 py-3 text-slate-200">Cancel</button></div>
            </form>
          </div>

          <aside className="xl:sticky xl:top-5">
            <div className="mb-3 flex items-center justify-between text-xs tracking-[.18em] text-slate-400"><span>LIVE CREATOR PAGE PREVIEW</span><span>UPDATES AS YOU TYPE</span></div>
            <article className="overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1520] shadow-2xl">
              <div className="h-2" style={{ backgroundColor: accent }} />
              <div className="p-6 md:p-8">
                <div className="text-xs font-bold tracking-[.25em]" style={{ color: accent }}>SKYNZ CREATOR</div>
                <h2 className="mt-3 break-words text-3xl font-extrabold">{draft.title || 'Your creator name'}</h2>
                <p className="mt-1 text-slate-400">@{draft.handle || 'your-handle'}</p>
                <p className="mt-5 whitespace-pre-wrap break-words leading-relaxed text-slate-300">{draft.description || 'Your creator story appears here.'}</p>
                {previewEmbed && <iframe title="Creator media preview" src={previewEmbed} className="mt-6 h-[230px] w-full rounded-xl bg-slate-900" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
                {draft.platforms.length > 0 && <div className="mt-6"><div className="mb-2 text-sm font-semibold text-slate-300">Find me on</div><div className="flex flex-wrap gap-2">{draft.platforms.map((id) => { const url = safeUrl(draft.social_links?.[id]); const name = PLATFORMS.find(([platform]) => platform === id)?.[1] || id; return url ? <a key={id} href={url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-600 px-3 py-2 text-sm capitalize text-slate-200 hover:border-cyan-300">{name} ↗</a> : <span key={id} className="rounded-lg border border-slate-700 px-3 py-2 text-sm capitalize text-slate-500">{name} · add link</span>; })}</div></div>}
                {safeUrl(draft.affiliate_link) && <a href={safeUrl(draft.affiliate_link)} target="_blank" rel="noopener noreferrer" className="mt-6 block rounded-xl py-3 text-center font-bold text-slate-950" style={{ backgroundColor: accent }}>Support this creator</a>}
              </div>
            </article>
            <p className="mt-3 text-xs text-slate-500">Preview only. Review the page and press save when it is ready. AI suggestions never publish automatically.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
