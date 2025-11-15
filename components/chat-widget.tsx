// components/chat-widget.tsx - SIMPLE VERSION
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, X, Minimize2 } from 'lucide-react';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Halo! Saya AI Assistant De.Amoura 👋\nSaya siap membantu Anda:\n• Memilih hijab yang tepat\n• Memberi saran styling\n• Menjelaskan bahan dan perawatan\n• Mengarahkan ke Tokopedia untuk pembelian\n\nSilakan tanyakan apapun tentang hijab!",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: ChatMessage = { 
      text: input, 
      isUser: true, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();
      const botMessage: ChatMessage = { 
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { 
        text: "Maaf, sedang ada gangguan. Silakan coba lagi nanti atau langsung kunjungi katalog kami.", 
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = [
    "Rekomendasi hijab untuk acara formal",
    "Bahan yang nyaman untuk sehari-hari",
    "Cara styling hijab segi empat",
    "Lihat koleksi pashmina"
  ];

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg border-0"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 flex flex-col z-50 shadow-xl border border-gray-200">
          <CardHeader className="flex-row items-center justify-between p-4 border-b bg-blue-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">De.Amoura Assistant</h3>
                <p className="text-xs text-gray-600">Siap membantu</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4 bg-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[85%] p-3 rounded-2xl ${
                  msg.isUser 
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className="text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <div className="inline-block bg-gray-100 p-3 rounded-2xl rounded-bl-none border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-3 border-t bg-white rounded-b-lg">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(reply);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya tentang hijab..."
                className="flex-1 text-sm border-gray-300 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                onClick={handleSend}
                disabled={loading}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 border-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}