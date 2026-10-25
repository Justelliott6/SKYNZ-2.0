import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { proposePageDesign } from '../utils/pageDesigner';

const PageBuilderPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!!pageId);
  const [designPrompt, setDesignPrompt] = useState('');
  const [designFeedback, setDesignFeedback] = useState('');
  const [mintPreview, setMintPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    handle: '',
    description: '',
    platforms: [],
    platform_urls: {},
    widgets: [],
    embed_url: '',
    affiliate_link: ''
  });

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: '▶️' },
    { id: 'spotify', name: 'Spotify', icon: '🎵' },
    { id: 'twitch', name: 'Twitch', icon: '📺' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'tiktok', name: 'TikTok', icon: '🎬' },
    { id: 'discord', name: 'Discord', icon: '💬' },
    { id: 'patreon', name: 'Patreon', icon: '❤️' },
    { id: 'twitter', name: 'Twitter', icon: '𝕏' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'soundcloud', name: 'SoundCloud', icon: '☁️' },
    { id: 'website', name: 'Website', icon: '🌐' }
  ];

  useEffect(() => {
    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pages/edit/${pageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch page');

      const data = await response.json();
      setFormData({
        title: data.title,
        handle: data.handle,
        description: data.description,
        platforms: data.platforms || [],
        platform_urls: data.platform_urls || {},
        widgets: data.widgets || [],
        embed_url: data.embed_url || '',
        affiliate_link: data.affiliate_link || ''
      });
    } catch (error) {
      toast.error('Failed to load page');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePlatform = (platformId) => {
    setFormData({
      ...formData,
      platforms: formData.platforms.includes(platformId)
        ? formData.platforms.filter(p => p !== platformId)
        : [...formData.platforms, platformId]
    });
  };

  const applyDesigner = () => {
    const result = proposePageDesign(designPrompt, formData);
    setFormData(current => ({ ...current, ...result.changes }));
    setDesignFeedback(result.explanation);
  };

  const checkMintPreview = async () => {
    if (!pageId) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pages/${pageId}/mint-preview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Unable to check mint preparation');
      setMintPreview(await response.json());
    } catch (error) {
      toast.error(error.message);
    }
  };

  const downloadPage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pages/${pageId}/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Page export failed');
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `skynz-page-${pageId}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = pageId ? 'PUT' : 'POST';
      const url = pageId
        ? `${process.env.REACT_APP_API_URL}/api/pages/${pageId}`
        : `${process.env.REACT_APP_API_URL}/api/pages`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save page');

      const data = await response.json();
      toast.success(pageId ? 'Page updated!' : 'Page created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to save page');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8">
          {pageId ? 'Edit Page' : 'Create New SKYNZ Page'}
        </h1>

        <section className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mb-6 space-y-3">
          <h2 className="text-white text-xl font-bold">Page Designer Assistant</h2>
          <p className="text-gray-300 text-sm">Describe the page you want. This first version runs locally without an AI subscription. Review and save its suggestions.</p>
          <textarea value={designPrompt} onChange={e => setDesignPrompt(e.target.value)}
            placeholder="Make a southern country rock music page with YouTube, Spotify and live chat"
            className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white" rows={3} />
          <button type="button" onClick={applyDesigner}
            className="bg-cyan-700 hover:bg-cyan-600 text-white px-5 py-3 rounded-lg font-semibold">Apply design suggestions</button>
          {designFeedback && <p role="status" className="text-cyan-200 text-sm">{designFeedback}</p>}
        </section>

        {pageId && (
          <section className="bg-black/50 border border-purple-500/30 rounded-xl p-6 mb-6 space-y-3">
            <h2 className="text-white text-xl font-bold">Mint Preparation</h2>
            <button type="button" onClick={downloadPage}
              className="bg-cyan-700 text-white px-5 py-3 rounded-lg">Download page configuration</button>
            <p className="text-gray-300 text-sm">Save changes first, then inspect the stored page's metadata. Minting and publishing remain disabled.</p>
            <button type="button" onClick={checkMintPreview}
              className="bg-purple-700 text-white px-5 py-3 rounded-lg">Check saved page metadata</button>
            {mintPreview && (
              <div className="text-gray-200 text-sm space-y-2">
                <p>Draft status: {mintPreview.publishStatus} | Mint: {mintPreview.mintStatus}</p>
                <p>{mintPreview.readyForMetadataReview ? 'Metadata fields are ready for review.' : `Missing: ${mintPreview.missing.join(', ')}`}</p>
                <pre className="whitespace-pre-wrap break-all bg-black p-3 rounded">{JSON.stringify(mintPreview.manifest, null, 2)}</pre>
              </div>
            )}
          </section>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-white text-xl font-bold mb-4">Page Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Page Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                  placeholder="Night Vibe Lounge"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Handle (@username)</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">@</span>
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    className="flex-1 bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                    placeholder="night-vibe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                  placeholder="A late-night lounge of electronic, chill, and neon wave sounds."
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-white text-xl font-bold mb-4">Select Platforms</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 transition ${
                    formData.platforms.includes(platform.id)
                      ? 'bg-purple-600 border-purple-400'
                      : 'bg-black/50 border-purple-500/30 hover:border-purple-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{platform.icon}</div>
                  <div className="text-white text-sm font-semibold">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          {formData.platforms.length > 0 && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 space-y-3">
              <h2 className="text-white text-xl font-bold">Your Platform Links</h2>
              {formData.platforms.map(platform => (
                <label key={platform} className="block text-gray-300 capitalize">
                  {platform} URL
                  <input type="url" placeholder="https://" value={formData.platform_urls[platform] || ''}
                    onChange={e => setFormData(current => ({...current, platform_urls: {...current.platform_urls, [platform]: e.target.value}}))}
                    className="block w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white mt-1" />
                </label>
              ))}
            </div>
          )}

          <section className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 space-y-3">
            <h2 className="text-white text-xl font-bold">Media & App Widgets</h2>
            <p className="text-gray-300 text-sm">Add up to 12 boxes. YouTube and Spotify accept regular share links. App widgets use links until their integrations are ready.</p>
            {(formData.widgets || []).map((widget, index) => (
              <div key={index} className="bg-black/40 p-3 rounded-lg space-y-2">
                <select value={widget.type} onChange={e => setFormData(prev => ({ ...prev, widgets: prev.widgets.map((w, i) => i === index ? {...w, type: e.target.value} : w) }))}
                  className="bg-black text-white border border-purple-500 p-2 rounded">
                  <option value="youtube">YouTube</option><option value="spotify">Spotify</option><option value="link">App / external link</option>
                </select>
                <input type="text" placeholder="Box title" value={widget.title || ''} onChange={e => setFormData(prev => ({...prev, widgets: prev.widgets.map((w,i) => i === index ? {...w, title:e.target.value} : w)}))}
                  className="block w-full bg-black text-white p-2 border border-purple-500 rounded" />
                <input type="url" placeholder="https://..." value={widget.url || ''} onChange={e => setFormData(prev => ({...prev, widgets: prev.widgets.map((w,i) => i === index ? {...w, url:e.target.value} : w)}))}
                  className="block w-full bg-black text-white p-2 border border-purple-500 rounded" />
                <button type="button" onClick={() => setFormData(prev => ({...prev, widgets: prev.widgets.filter((_,i) => i !== index)}))}
                  className="text-red-300 underline">Remove box</button>
              </div>
            ))}
            <button type="button" disabled={formData.widgets.length >= 12}
              onClick={() => setFormData(prev => ({...prev, widgets:[...prev.widgets, {type:'youtube',title:'',url:''}]}))}
              className="bg-purple-700 text-white rounded px-4 py-2 disabled:opacity-50">Add media or app box</button>
          </section>

          {/* Embeds & Links */}
          <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-white text-xl font-bold mb-4">Embeds & Links</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Embed URL (YouTube, etc.)</label>
                <input
                  type="url"
                  name="embed_url"
                  value={formData.embed_url}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Affiliate/Support Link</label>
                <input
                  type="url"
                  name="affiliate_link"
                  value={formData.affiliate_link}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                  placeholder="https://skynz.link/your-handle"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : pageId ? 'Update Page' : 'Create Page'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PageBuilderPage;
