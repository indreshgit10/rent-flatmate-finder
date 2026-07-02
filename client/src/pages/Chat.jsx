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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading chat...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-4 h-[calc(100vh-120px)] flex flex-col">
      <div className="bg-white rounded-t-lg shadow p-4 border-b" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Chat</h2>
      </div>

      <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'var(--color-background)' }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No messages yet. Say hello!</div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender._id === currentUserId || msg.sender === currentUserId;
            return (
              <div key={idx} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-500 mb-1 px-1">
                  {isOwn ? 'You' : msg.sender?.name || 'User'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div 
                  className={`px-4 py-2 rounded-lg max-w-[75%] break-words ${isOwn ? 'text-white' : 'bg-white border'}`}
                  style={{ 
                    backgroundColor: isOwn ? 'var(--color-primary)' : 'var(--color-surface)',
                    borderColor: isOwn ? 'transparent' : 'var(--color-border)',
                    color: isOwn ? 'white' : 'var(--color-text)'
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

      <form onSubmit={handleSend} className="bg-white p-4 rounded-b-lg shadow flex gap-2" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-6 py-2 rounded-lg text-white font-medium transition disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
