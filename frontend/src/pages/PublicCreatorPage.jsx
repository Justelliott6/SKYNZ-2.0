import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const validLink = (v) => { try { const u=new URL(v); return ['https:','http:'].includes(u.protocol)?u.href:''; } catch { return ''; } };
const mediaLink = (v) => { try {
  const u=new URL(v);
  if(u.hostname==='youtu.be') return 'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(u.pathname.slice(1));
  if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)&&u.pathname==='/watch') return 'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(u.searchParams.get('v')||'');
  if(['youtube.com','www.youtube.com','www.youtube-nocookie.com'].includes(u.hostname)&&u.pathname.startsWith('/embed/')) return validLink(v);
  if(u.hostname==='open.spotify.com'&&/^\/(track|playlist|album|episode)\//.test(u.pathname))return 'https://open.spotify.com/embed'+u.pathname;
  return '';
} catch {return '';} };
const accents={emerald:'#39d99a',cyan:'#37b9ed',amber:'#f3b657',rose:'#f07b99'};
const PublicCreatorPage = () => {
  const { handle } = useParams();
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchPage();
    initializeSocket();
  }, [handle]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pages/${handle}`);
      if (!response.ok) throw new Error('Page not found');

      const data = await response.json();
      setPage(data);

      // Record page view
      await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: data.id })
      });
    } catch (error) {
      toast.error('Page not found');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSocket = () => {
    const newSocket = io(process.env.REACT_APP_API_URL);
    newSocket.on('connect', () => {
      newSocket.emit('join_page', handle);
    });

    newSocket.on('new_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim()) return;

    if (!socket) return;
    socket.emit('send_message', {
      pageHandle: handle,
      username: username,
      message: newMessage
    });

    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <p className="text-gray-400">Loading page...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <p className="text-gray-400">Page not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080e14] text-white p-4 md:p-8" style={{borderTop:`6px solid ${accents[page.theme]||accents.emerald}`}}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
              <h1 className="text-white text-3xl font-bold mb-2">{page.title}</h1>
              <p className="text-gray-400 mb-4">@{page.handle}</p>
              <p className="text-gray-300">{page.description}</p>
            </div>

            {/* Supported media players */}
            {[page.embed_url,page.second_embed_url].filter(Boolean).map((url,i)=>mediaLink(url)&&(
              <div key={i} className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                <iframe title={'Creator player '+(i+1)} src={mediaLink(url)} width="100%" height="300" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
              </div>
            ))}
            {/* Verified creator-supplied links */}
            {page.social_links && Object.entries(page.social_links).some(([,url])=>validLink(url)) && (
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
                <h3 className="font-bold mb-4">Find me online</h3>
                <div className="flex flex-wrap gap-3">{Object.entries(page.social_links).filter(([,url])=>validLink(url)).map(([name,url])=>(
                  <a key={name} href={validLink(url)} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-600 px-4 py-2 capitalize hover:border-emerald-400">{name}</a>
                ))}</div>
              </div>
            )}

            {/* Support Link */}
            {page.affiliate_link && (
              <a
                href={page.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg text-center transition"
              >
                Support the Creator
              </a>
            )}
          </div>

          {/* Live Chat Sidebar */}
          <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6 flex flex-col h-fit">
            <h3 className="text-white text-lg font-bold mb-4">Live Chat</h3>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-96">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm">No messages yet. Be the first!</p>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="bg-black/50 rounded-lg p-3">
                    <p className="text-cyan-400 text-sm font-semibold">{msg.username}</p>
                    <p className="text-gray-300 text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="space-y-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 transition"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Say something..."
                  className="flex-1 bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCreatorPage;
