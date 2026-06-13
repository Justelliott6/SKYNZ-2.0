import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const PageBuilderPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!!pageId);
  const [formData, setFormData] = useState({
    title: '',
    handle: '',
    description: '',
    platforms: [],
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pages/${pageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch page');

      const data = await response.json();
      setFormData({
        title: data.title,
        handle: data.handle,
        description: data.description,
        platforms: data.platforms || [],
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
