"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Send, Bot, User } from "lucide-react";

export default function ChatUI() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: "/api/chat",
  });

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-6">
      <Card className="w-full max-w-lg shadow-lg border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-center py-3">
          <CardTitle className="text-lg font-semibold">🌸 de.amoura Chatbot AI</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* CHAT AREA */}
          <ScrollArea
            ref={chatRef}
            className="h-[400px] p-4"
          >
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 max-w-[80%] ${
                    msg.role === "user" ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={msg.role === "user" ? "bg-pink-200" : "bg-gray-200"}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-pink-200 text-gray-800"
                        : "bg-gray-100 text-gray-700 border border-pink-100"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 self-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-200">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-2xl bg-gray-100 border border-pink-100">
                    <Spinner className="w-4 h-4" />
                    <p className="text-sm text-gray-500 ml-2">Chatbot sedang mengetik...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* INPUT AREA */}
          <form
            onSubmit={handleSubmit}
            className="flex border-t p-3 bg-gray-50 items-center gap-2"
          >
            <Input
              className="flex-grow focus:ring-pink-300"
              value={input}
              onChange={handleInputChange}
              placeholder="Tulis pertanyaanmu di sini..."
            />
            <Button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50"
              disabled={isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
