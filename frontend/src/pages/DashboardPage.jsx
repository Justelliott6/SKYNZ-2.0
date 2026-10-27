import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import PersonalCreatorApps from '../components/PersonalCreatorApps';

const DashboardPage = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuthStore();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch pages');

      const data = await response.json();
      setPages(data);
    } catch (error) {
      toast.error('Failed to load pages');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete page');

      setPages(pages.filter(p => p.id !== pageId));
      toast.success('Page deleted');
    } catch (error) {
      toast.error('Failed to delete page');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name}!</p>
        </div>

        <div className="mb-8"><PersonalCreatorApps isOwner /></div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Pages</p>
            <p className="text-white text-3xl font-bold mt-2">{pages.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Views</p>
            <p className="text-white text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Earnings</p>
            <p className="text-white text-3xl font-bold mt-2">$0</p>
          </div>
        </div>

        {/* Create New Page Button */}
        <Link
          to="/page-builder"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-lg mb-8 transition"
        >
          <FiPlus size={20} />
          Create New Page
        </Link>

        {/* Pages List */}
        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading pages...</div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 mb-4">No pages yet. Create your first SKYNZ page!</p>
              <Link
                to="/page-builder"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-lg transition"
              >
                <FiPlus size={20} />
                Create Page
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Title</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Handle</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Created</th>
                    <th className="px-6 py-4 text-right text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id} className="border-b border-purple-500/20 hover:bg-purple-900/20 transition">
                      <td className="px-6 py-4 text-white font-semibold">{page.title}</td>
                      <td className="px-6 py-4 text-gray-400">@{page.handle}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(page.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <a
                          href={`/creator/${page.handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition"
                          title="View Page"
                        >
                          <FiEye size={18} />
                        </a>
                        <Link
                          to={`/creator-studio/${page.handle}`}
                          className="text-pink-300 hover:text-pink-200 text-sm font-semibold"
                          title="Open private Creator Studio"
                        >
                          Studio
                        </Link>
                        <Link
                          to={`/page-builder/${page.id}`}
                          className="text-purple-400 hover:text-purple-300 transition"
                          title="Edit Page"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="text-red-400 hover:text-red-300 transition"
                          title="Delete Page"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
