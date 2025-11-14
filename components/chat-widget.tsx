'use client';

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
  products?: any[];
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
        text: "Haii! 👋 Aku De.Amoura Bot! 💕\nAku siap bantu kamu cari hijab favorit di katalog kita!\nTanya aja tentang produk, warna, atau rekomendasi! ✨",
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
        timestamp: new Date(),
        products: data.products
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { 
        text: "Haii! Maaf ya, lagi gangguan nih 😔 Coba lagi ya atau langsung lihat katalog kita! 💖", 
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = [
    "Rekomendasi hijab terbaru",
    "Hijab warna apa yang ada?",
    "Harga termurah berapa?",
    "Lihat semua kategori"
  ];

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 flex flex-col z-50">
          <CardHeader className="flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">D</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">De.Amoura Bot</h3>
                <p className="text-xs text-gray-500">Online • Fast Response</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                  msg.isUser 
                    ? 'bg-pink-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className="text-sm">{line}</p>
                  ))}
                  
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2 p-2 bg-white bg-opacity-50 rounded">
                      <p className="text-xs font-semibold mb-1">💖 Produk Rekomendasi:</p>
                      {msg.products.map((product: any, i: number) => (
                        <div key={i} className="text-xs">
                          • {product.name} - Rp {product.price}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <div className="inline-block bg-gray-100 p-3 rounded-2xl rounded-bl-none">
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

          <div className="p-3 border-t">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(reply)}
                  className="text-xs h-7"
                >
                  {reply}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya tentang hijab..."
                className="flex-1 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                onClick={handleSend}
                disabled={loading}
                size="icon"
                className="bg-pink-500 hover:bg-pink-600"
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