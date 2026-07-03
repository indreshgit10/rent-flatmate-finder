import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';
import { getChatMessages } from '../services/chatService';

const Chat = () => {
  const { id: interestId } = useParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentUserId = user?._id || user?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getChatMessages(interestId);
        setMessages(data.data);
      } catch (err) {
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [interestId]);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, {
      auth: { token }
    });

    socketRef.current.emit('join_chat', interestId);

    socketRef.current.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on('error', (err) => {
      console.error('Socket error:', err);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [interestId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketRef.current.emit('send_message', {
      interestId,
      senderId: currentUserId,
      content: newMessage.trim()
    });

    setNewMessage('');
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading chat...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '1rem auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
      <div style={{ background: 'var(--color-surface-raised)', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', zIndex: 10 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>Chat</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-bg)' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>No messages yet. Say hello!</div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender._id === currentUserId || msg.sender === currentUserId;
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', padding: '0 0.25rem' }}>
                  {isOwn ? 'You' : msg.sender?.name || 'User'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div 
                  style={{ 
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-lg)',
                    maxWidth: '75%',
                    wordBreak: 'break-word',
                    backgroundColor: isOwn ? 'var(--color-primary)' : 'var(--color-surface)',
                    border: isOwn ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    color: isOwn ? '#ffffff' : 'var(--color-text)',
                    boxShadow: 'var(--shadow-sm)',
                    borderBottomRightRadius: isOwn ? '2px' : 'var(--radius-lg)',
                    borderBottomLeftRadius: isOwn ? 'var(--radius-lg)' : '2px',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ background: 'var(--color-surface-raised)', padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', color: 'var(--color-text)', fontSize: '0.95rem' }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          style={{ padding: '0 1.5rem', background: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: 600, cursor: !newMessage.trim() ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', opacity: !newMessage.trim() ? 0.6 : 1 }}
          onMouseEnter={(e) => !!newMessage.trim() && (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
          onMouseLeave={(e) => !!newMessage.trim() && (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
