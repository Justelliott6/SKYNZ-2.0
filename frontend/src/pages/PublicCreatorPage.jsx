import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import AIDesigner from '../components/AIDesigner';
import { CreatorPage } from '../components/creatorPage';
import createCreatorPageConfig from '../config/creatorPageConfig';
import defaultTheme from '../theme/defaultTheme';
import themePresets from '../theme/themePresets';
import { themeToVariables } from '../theme/themeEngine';

const PublicCreatorPage = () => {
  const { handle } = useParams();
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let active = true;
    const socket = io(process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL);

    const fetchPage = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pages/${handle}`);
        if (!response.ok) throw new Error('Page not found');
        const data = await response.json();
        if (!active) return;
        setConfig(createCreatorPageConfig(data));
        await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId: data.id })
        });
      } catch (error) {
        if (active) {
          toast.error('Page not found');
          console.error(error);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    socket.on('connect', () => socket.emit('join_page', handle));
    socket.on('new_message', (data) => setMessages((previous) => [...previous, data]));
    fetchPage();

    return () => {
      active = false;
      socket.disconnect();
    };
  }, [handle]);

  const updateTheme = (changes) => setConfig((current) => ({ ...current, theme: { ...current.theme, ...changes } }));

  const updateCreator = (changes) => {
    if (changes.preset) updateTheme(themePresets[changes.preset]);
    setConfig((current) => ({ ...current, creator: { ...current.creator, ...changes } }));
  };

  const sendMessage = ({ username, message }) => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL);
    socket.emit('send_message', { pageHandle: handle, username, message });
    socket.disconnect();
  };

  if (isLoading) return <div className="creator-loading">Loading creator page...</div>;
  if (!config) return <div className="creator-loading">Page not found</div>;

  const theme = { ...defaultTheme, ...config.theme };
  return (
    <div className="creator-experience" style={themeToVariables(theme)}>
      <div className="creator-toolbar"><span className="brand-mark">SKYNZ</span><span>Creator page preview</span></div>
      <div className="creator-workspace">
        <CreatorPage config={{ ...config, theme }} messages={messages} onSendMessage={sendMessage} />
        <AIDesigner theme={theme} creator={config.creator} onThemeChange={updateTheme} onCreatorChange={updateCreator} />
      </div>
    </div>
  );
};

export default PublicCreatorPage;
