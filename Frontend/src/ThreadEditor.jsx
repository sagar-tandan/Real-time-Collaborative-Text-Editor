import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, X, Maximize2, Minimize2, Phone, Video } from 'lucide-react';

const ChatPopup = ({ chat, onClose, onMinimize, isMinimized }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey there!', sender: 'other', timestamp: new Date() },
    { id: 2, text: 'Hi! How are you?', sender: 'self', timestamp: new Date() }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isMinimized]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        text: message,
        sender: 'self',
        timestamp: new Date()
      }]);
      setMessage('');
    }
  };

  if (isMinimized) {
    return (
      <div className="w-60 h-12 bg-white shadow-lg rounded-t-lg border flex items-center justify-between px-4 cursor-pointer"
           onClick={() => onMinimize(chat.id)}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <span className="font-medium truncate">{chat.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-96 bg-white shadow-lg rounded-t-lg border flex flex-col">
      {/* Header */}
      <div className="p-2 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <span className="font-medium">{chat.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-gray-200 rounded-full">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded-full">
            <Video className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onMinimize(chat.id)}
            className="p-1.5 hover:bg-gray-200 rounded-full"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onClose(chat.id)}
            className="p-1.5 hover:bg-gray-200 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${msg.sender === 'self' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-2 ${
                msg.sender === 'self' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-4 h-4 text-gray-500" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Aa"
            className="flex-1 p-1.5 rounded-full bg-gray-100 text-sm focus:outline-none"
          />
          <button className="p-1.5 hover:bg-gray-100 rounded-full">
            <Smile className="w-4 h-4 text-gray-500" />
          </button>
          <button 
            onClick={sendMessage}
            className="p-1.5 hover:bg-gray-100 rounded-full"
          >
            <Send className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TextEditor = () => {
  const [activeChats, setActiveChats] = useState([
    { id: 1, name: 'John Doe', minimized: false },
    { id: 2, name: 'Jane Smith', minimized: true }
  ]);
  const [contacts, setContacts] = useState([
    { id: 3, name: 'Alice Johnson', online: true },
    { id: 4, name: 'Bob Wilson', online: false },
    { id: 5, name: 'Carol Brown', online: true }
  ]);
  const [showContacts, setShowContacts] = useState(false);

  const toggleChat = (contact) => {
    if (!activeChats.find(chat => chat.id === contact.id)) {
      setActiveChats([...activeChats, { id: contact.id, name: contact.name, minimized: false }]);
    }
    setShowContacts(false);
  };

  const closeChat = (chatId) => {
    setActiveChats(activeChats.filter(chat => chat.id !== chatId));
  };

  const toggleMinimize = (chatId) => {
    setActiveChats(activeChats.map(chat => 
      chat.id === chatId ? { ...chat, minimized: !chat.minimized } : chat
    ));
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4">
          <div
            contentEditable
            className="min-h-[500px] focus:outline-none"
            placeholder="Start typing..."
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="fixed bottom-0 right-0 flex items-end gap-4 p-4">
        {/* Contact List Toggle */}
        <div className="relative">
          {showContacts && (
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border">
              <div className="p-3 border-b">
                <h3 className="font-semibold">Contacts</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {contacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => toggleChat(contact)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-300 rounded-full" />
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        contact.online ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <span>{contact.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setShowContacts(!showContacts)}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <Maximize2 className="w-6 h-6 text-blue-500" />
          </button>
        </div>

        {/* Chat Windows */}
        <div className="flex items-end gap-4">
          {activeChats.map(chat => (
            <ChatPopup
              key={chat.id}
              chat={chat}
              onClose={closeChat}
              onMinimize={toggleMinimize}
              isMinimized={chat.minimized}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;