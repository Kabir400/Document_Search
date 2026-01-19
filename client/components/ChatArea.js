"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";

const ChatArea = ({ chatId }) => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/get-messages/${chatId}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (data.suceess) {
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageContent = input.trim();
    setInput("");
    
    // Optimistic update
    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      { _id: tempId, role: "user", content: userMessageContent, createdAt: new Date().toISOString() },
    ]);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/v1/send-message/${chatId}`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify({ content: userMessageContent }),
      });
      
      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      
      if (data.suceess) {
          // Add AI message
          setMessages(prev => [...prev, data.data.message]);
      } else {
          // Handle error (maybe remove optimistic message or show error)
          console.error("API Error:", data.message);
           setMessages((prev) => [
            ...prev,
            { _id: Date.now(), role: "assistant", content: "Sorry, I encountered an error answering that.", isError: true },
          ]);
      }

    } catch (error) {
        console.error("Network Error:", error);
         setMessages((prev) => [
            ...prev,
            { _id: Date.now(), role: "assistant", content: "Sorry, network error occurred.", isError: true },
          ]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-white">
           Chat Session
        </h2>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center opacity-50">
                <p className="text-sm text-zinc-500">No messages yet. Start the conversation!</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg._id || msg.id}
            className={`flex w-full ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[80%] md:max-w-[70%] items-start gap-4 rounded-2xl px-5 py-4 ${
                msg.role === "user"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : msg.isError 
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              {msg.role === 'assistant' && !msg.isError && (
                 <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-gradient-to-tr from-green-400 to-blue-500" />
              )}
              <div className="prose dark:prose-invert text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
             <div className="flex w-full justify-start">
                <div className="flex max-w-[80%] items-center gap-4 rounded-2xl bg-zinc-100 px-5 py-4 dark:bg-zinc-900">
                     <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 animate-pulse" />
                     <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce"></span>
                     </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="w-full border-t border-zinc-200 bg-white pb-6 pt-4 px-4 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="relative flex w-full items-center rounded-xl border border-zinc-200 bg-white px-2 py-2 shadow-sm focus-within:ring-1 focus-within:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:ring-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              disabled={loading}
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none dark:text-white dark:placeholder:text-zinc-500 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className="!w-auto !rounded-lg !px-3 !py-2 transition-transform active:scale-95"
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              )}
            </Button>
          </form>
          <p className="mt-2 text-center text-[10px] text-zinc-400">
             AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
