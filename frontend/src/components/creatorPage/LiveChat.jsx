import React, { useState } from 'react';
import { FiMessageCircle, FiSend } from 'react-icons/fi';

const LiveChat = ({ messages, onSendMessage, enabled = true }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const submitMessage = (event) => {
    event.preventDefault();
    if (!message.trim() || !username.trim()) return;
    onSendMessage({ username: username.trim(), message: message.trim() });
    setMessage('');
  };

  return (
    <section className="panel-shell live-chat">
      <div className="panel-heading"><div><span className="section-kicker">Audience</span><h2><FiMessageCircle /> Live chat</h2></div><span className="online-label">Open</span></div>
      {!enabled ? <p className="muted-copy">Chat is hidden for this page.</p> : <>
        <div className="message-list">
          {messages.length === 0 ? <p className="muted-copy">No messages yet. Be the first to say hello.</p> : messages.map((item, index) => <article className="chat-message" key={item.id || index}><strong>{item.username}</strong><p>{item.message}</p></article>)}
        </div>
        <form className="chat-form" onSubmit={submitMessage}>
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Your name" aria-label="Your name" />
          <div><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Say something..." aria-label="Chat message" /><button className="icon-button" type="submit" title="Send message"><FiSend /></button></div>
        </form>
      </>}
    </section>
  );
};

export default LiveChat;
