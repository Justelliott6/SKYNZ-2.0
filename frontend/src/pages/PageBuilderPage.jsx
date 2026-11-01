import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const PLATFORMS = ['spotify','youtube','facebook','instagram','tiktok','twitch','soundcloud','discord','website'];
const initial = {title:'',handle:'',description:'',platforms:[],embed_url:'',affiliate_link:'',social_links:{},theme:'emerald',second_embed_url:''};
const colors = {emerald:'#39d99a',cyan:'#37b9ed',amber:'#f3b657',rose:'#f07b99'};
const safeURL = (value) => { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
const embedURL = (value) => {
  const url=safeURL(value); if(!url) return '';
  try {
    const u=new URL(url);
    if(u.hostname==='youtu.be') return 'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(u.pathname.slice(1));
    if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname) && u.pathname==='/watch') return 'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(u.searchParams.get('v')||'');
    if(['youtube.com','www.youtube.com','www.youtube-nocookie.com'].includes(u.hostname) && u.pathname.startsWith('/embed/')) return url;
    if(u.hostname==='open.spotify.com' && /^\/(track|playlist|album|episode)\//.test(u.pathname)) return 'https://open.spotify.com/embed'+u.pathname;
    return '';
  } catch { return ''; }
};
const Field=({label,children})=><label className="block text-sm text-slate-300 mb-4"><span className="block mb-1.5 font-semibold">{label}</span>{children}</label>;
const inputStyle='w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400';
export default function PageBuilderPage() {
  const {pageId}=useParams(), navigate=useNavigate(), {token}=useAuthStore();
  const [data,setData]=useState(initial),[loading,setLoading]=useState(Boolean(pageId)),[saving,setSaving]=useState(false),[tab,setTab]=useState('identity');
  const set=(key,value)=>setData(d=>({...d,[key]:value}));
  useEffect(()=>{
    if(!pageId) return;
    let live=true;
    (async()=>{try {
      const r=await fetch(API+'/api/pages/id/'+encodeURIComponent(pageId),{headers:{Authorization:'Bearer '+token}});
      if(!r.ok) throw new Error('Unable to load your page');
      const p=await r.json();
      if(live) setData({...initial,...p,social_links:p.social_links||{},platforms:p.platforms||[]});
    } catch(e){if(live) toast.error(e.message);} finally {if(live) setLoading(false);} })();
    return ()=>{live=false};
  },[pageId,token]);
  const save=async(e)=>{
    e.preventDefault(); setSaving(true);
    try {
      const r=await fetch(API+'/api/pages'+(pageId?'/'+encodeURIComponent(pageId):''),{
        method:pageId?'PUT':'POST',
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
        body:JSON.stringify({...data,handle:data.handle.trim().toLowerCase().replace(/^@/,'')})
      });
      const body=await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(body.error||'Could not save creator page');
      toast.success('Creator page saved');
      navigate('/dashboard');
    }catch(e){toast.error(e.message);}finally{setSaving(false);}
  };
  const accent=colors[data.theme]||colors.emerald;
  if(loading)return <main className="min-h-screen bg-slate-950 text-white p-10">Loading creator page…</main>;
  return <main className="min-h-screen bg-[#080e14] text-white px-4 py-7 md:px-8">
    <div className="max-w-[1450px] mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div><div className="text-xs tracking-[.25em] text-emerald-400 font-bold">SKYNZ / CREATOR CONTROL CENTER</div><h1 className="text-3xl font-bold mt-2">{pageId?'Edit your creator page':'Build your creator page'}</h1><p className="text-slate-400 mt-1">Your page. Your vibe. Your stage.</p></div>
        <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">Ownership minting: not connected</div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <form onSubmit={save} className="rounded-2xl border border-slate-800 bg-[#101923] p-5 md:p-7">
          <nav className="flex flex-wrap gap-2 mb-6" aria-label="Builder sections">{[['identity','Page'],['media','Media'],['social','Social'],['design','Design']].map(([key,name])=><button type="button" key={key} onClick={()=>setTab(key)} className={'px-4 py-2 rounded-xl text-sm font-semibold '+(tab===key?'bg-emerald-400 text-slate-950':'bg-slate-800 text-slate-300')}>{name}</button>)}</nav>
          {tab==='identity'&&<section>
            <Field label="Page title"><input required maxLength={120} className={inputStyle} value={data.title} onChange={e=>set('title',e.target.value)} placeholder="Your artist or creator name"/></Field>
            <Field label="Creator handle"><input required pattern="[a-zA-Z0-9_-]+" maxLength={50} className={inputStyle} value={data.handle} onChange={e=>set('handle',e.target.value)} placeholder="yourname"/></Field>
            <Field label="About your page"><textarea rows={5} maxLength={1500} className={inputStyle} value={data.description||''} onChange={e=>set('description',e.target.value)} placeholder="Tell visitors what you create"/></Field>
            <Field label="Support / affiliate link"><input type="url" className={inputStyle} value={data.affiliate_link||''} onChange={e=>set('affiliate_link',e.target.value)} placeholder="https://..."/></Field>
          </section>}
          {tab==='media'&&<section><p className="text-slate-400 text-sm mb-4">Paste Spotify or YouTube links. Supported links appear in the live preview.</p>
            <Field label="Main player URL"><input type="url" className={inputStyle} value={data.embed_url||''} onChange={e=>set('embed_url',e.target.value)} placeholder="https://open.spotify.com/playlist/..."/></Field>
            <Field label="Second player URL"><input type="url" className={inputStyle} value={data.second_embed_url||''} onChange={e=>set('second_embed_url',e.target.value)} placeholder="https://www.youtube.com/watch?v=..."/></Field>
          </section>}
          {tab==='social'&&<section><p className="text-slate-400 text-sm mb-4">Only links you enter will appear on the published page.</p>{PLATFORMS.map(p=><Field key={p} label={p[0].toUpperCase()+p.slice(1)}><input type="url" className={inputStyle} value={data.social_links?.[p]||''} onChange={e=>set('social_links',{...data.social_links,[p]:e.target.value})} placeholder={'https://'+p+'.com/...'} /></Field>)}</section>}
          {tab==='design'&&<section><p className="text-slate-300 mb-4">Accent color</p><div className="flex flex-wrap gap-3">{Object.entries(colors).map(([name,color])=><button key={name} type="button" aria-label={name} aria-pressed={data.theme===name} onClick={()=>set('theme',name)} style={{borderColor:data.theme===name?color:'#475569'}} className="rounded-xl border-2 px-4 py-3 capitalize" ><span style={{background:color}} className="inline-block w-3 h-3 rounded-full mr-2"/>{name}</button>)}</div></section>}
          <div className="flex flex-wrap gap-3 pt-5 border-t border-slate-800 mt-6"><button disabled={saving} type="submit" className="rounded-xl px-6 py-3 font-bold text-slate-950 disabled:opacity-50" style={{background:accent}}>{saving?'Saving…':pageId?'Save changes':'Create page'}</button><button type="button" onClick={()=>navigate('/dashboard')} className="rounded-xl border border-slate-600 px-5 py-3">Cancel</button></div>
        </form>
        <aside className="lg:sticky lg:top-5"><div className="text-xs tracking-widest text-slate-400 mb-3">LIVE PREVIEW · UPDATES AS YOU TYPE</div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 bg-[#0d1520] shadow-2xl">
            <div className="h-2" style={{background:accent}}/>
            <div className="p-6"><div className="text-xs font-bold tracking-[.25em]" style={{color:accent}}>SKYNZ CREATOR</div><h2 className="text-3xl font-extrabold mt-3 break-words">{data.title||'Your creator name'}</h2><p className="text-slate-400 mt-1">@{data.handle||'your-handle'}</p><p className="mt-4 text-slate-300 whitespace-pre-wrap break-words">{data.description||'Your creator story appears here.'}</p>
              {[data.embed_url,data.second_embed_url].filter(Boolean).map((link,i)=>embedURL(link)?<iframe key={i} title={'Creator media '+(i+1)} src={embedURL(link)} className="w-full mt-5 rounded-xl bg-slate-900" style={{height:230}} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>:<div key={i} className="mt-4 text-amber-300 text-sm">Player {i+1}: enter a supported Spotify or YouTube URL.</div>)}
              <div className="flex flex-wrap gap-2 mt-5">{Object.entries(data.social_links||{}).filter(([p,url])=>PLATFORMS.includes(p)&&safeURL(url)).map(([p,url])=><a key={p} href={safeURL(url)} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-600 px-3 py-2 text-sm capitalize">{p}</a>)}</div>
              {safeURL(data.affiliate_link)&&<a href={safeURL(data.affiliate_link)} target="_blank" rel="noopener noreferrer" className="block mt-5 text-center rounded-xl py-3 font-bold text-slate-950" style={{background:accent}}>Support this creator</a>}
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3">Preview only. Save to update the published page. Streaming and minting are separate future integrations.</p>
        </aside>
      </div>
    </div>
  </main>;
}
