// components/chatbot-component.tsx
'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface ChatMessage {
    type: 'user' | 'bot';
    message: string;
    timestamp?: number;
}

function ChatbotComponentInner() {
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { type: 'bot', message: 'Haii! 👋 Ada yang bisa aku bantu tentang hijab de.amoura? Tanya-tanya yuk! ✨' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll chat to bottom when new messages arrive
    useEffect(() => {
        if (chatMessagesRef.current) {
            // Use requestAnimationFrame to avoid interfering with input focus
            requestAnimationFrame(() => {
                if (chatMessagesRef.current) {
                    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
                }
            });
        }
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isChatLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message to chat
        setChatMessages(prev => [...prev, { type: 'user', message: userMessage, timestamp: Date.now() }]);
        setIsChatLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`Chat request failed: ${response.status}`);
            }

            const data = await response.json();

            // Add bot response to chat
            if (data.text) {
                setChatMessages(prev => {
                    const updated: ChatMessage[] = [...prev, { type: 'bot', message: data.text, timestamp: Date.now() }];
                    return updated;
                });
            } else if (data.response) {
                setChatMessages(prev => [...prev, { type: 'bot', message: data.response, timestamp: Date.now() }]);
            } else {
                setChatMessages(prev => [...prev, { type: 'bot', message: 'Maaf ada gangguan nih. Coba lagi ya! 💕', timestamp: Date.now() }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setChatMessages(prev => [...prev, { type: 'bot', message: 'Maaf ada gangguan nih. Coba lagi ya! 💕', timestamp: Date.now() }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    return (
        <>
            {!showChatbot && (
                <button
                    onClick={() => setShowChatbot(true)}
                    className="fixed bottom-8 right-8 premium-gradient text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-110 z-40 group"
                >
                    <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
                    <span className="absolute -top-2 -right-2 bg-destructive w-4 h-4 rounded-full border-2 border-white"></span>
                </button>
            )}

            {showChatbot && (
                <div
                    className="chat-window fixed bottom-8 right-8 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-border animate-in slide-in-from-bottom-10 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="premium-gradient text-white p-4 rounded-t-2xl flex items-center justify-between shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Assistant de.amoura</h3>
                                <p className="text-xs opacity-80">Online • Balas Cepat</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowChatbot(false)}
                            className="hover:bg-white/10 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/30">
                        {chatMessages && chatMessages.length > 0 ? (
                            chatMessages.map((msg, index) => (
                                <div
                                    key={msg.timestamp || index}
                                    data-message-type={msg.type}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm break-words ${msg.type === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-secondary text-foreground rounded-bl-none'
                                            }`}
                                    >
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-amber-700 text-sm">Mulai percakapan...</div>
                        )}
                        {isChatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-secondary text-foreground p-3 rounded-2xl rounded-bl-none">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t border-border rounded-b-2xl">
                        <div className="flex space-x-2">
                            <input
                                ref={chatInputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isChatLoading) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onFocus={(e) => e.stopPropagation()}
                                onBlur={(e) => {
                                    // Prevent blur if clicking within the chat window
                                    const relatedTarget = e.relatedTarget as HTMLElement;
                                    if (relatedTarget && e.currentTarget.closest('.chat-window')?.contains(relatedTarget)) {
                                        e.preventDefault();
                                        e.currentTarget.focus();
                                    }
                                }}
                                placeholder="Ketik pertanyaan Anda..."
                                disabled={isChatLoading}
                                className="flex-1 px-4 py-2 border border-amber-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent text-amber-900 placeholder-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isChatLoading}
                                className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-2 rounded-full hover:from-amber-600 hover:to-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Memoize component to prevent re-render when parent re-renders
export const ChatbotComponent = memo(ChatbotComponentInner);
