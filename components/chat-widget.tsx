// components/chat-widget.tsx
'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export function ChatWidget() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Halo! Saya Asisten de.amoura. Ada yang bisa saya bantu mengenai produk hijab kami?' }
  ]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');

    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', message: userMsg }]);

    // Add loading placeholder
    setChatMessages(prev => [...prev, { type: 'bot', message: '...' }]);

    try {
      // Call chatbot API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await response.json();

      // Replace loading with real response
      setChatMessages(prev => {
        const newHistory = [...prev];
        newHistory.pop(); // Remove loading
        newHistory.push({ type: 'bot', message: data.text || data.reply || "Maaf, terjadi kesalahan." });
        return newHistory;
      });

    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => {
        const newHistory = [...prev];
        newHistory.pop(); // Remove loading
        newHistory.push({
          type: 'bot',
          message: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti atau kunjungi katalog produk kami.'
        });
        return newHistory;
      });
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {showChatbot && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-amber-800">
          <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">de.amoura Assistant</h3>
                <p className="text-xs opacity-90">Siap membantu Anda</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-br-none'
                      : 'bg-amber-100 text-amber-900 rounded-bl-none border border-amber-200'
                    }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-amber-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tanya tentang produk hijab..."
                className="flex-1 px-4 py-2 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-2.5 rounded-full hover:from-amber-700 hover:to-amber-800 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}