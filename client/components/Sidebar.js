"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import Input from "./ui/Input";

const Sidebar = () => {
  const [chats, setChats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch chats on load
  useEffect(() => {
    fetchChats();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch("http://localhost:8000/api/v1/get-chats", {
        headers: getAuthHeaders(),
      });
      
      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (data.suceess) {
        setChats(data.data.chats);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (!newChatTitle.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/create-chat", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: newChatTitle }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (data.suceess) {
        setChats([data.data.chat, ...chats]);
        setIsModalOpen(false);
        setNewChatTitle("");
        router.push(`/${data.data.chat._id}`);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeId = pathname?.split("/")?.pop();

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-zinc-200 bg-zinc-50 transition-transform dark:border-zinc-800 dark:bg-black md:translate-x-0">
        <div className="flex h-full flex-col p-4">
          {/* Create New Button */}
          <Button onClick={() => setIsModalOpen(true)} className="mb-6">
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              New Chat
            </span>
          </Button>

          {/* Navigation Links */}
          <nav className="space-y-1 mb-6">
             <Link
              href="/train-ai"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === "/train-ai"
                  ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M15.5 2A1.5 1.5 0 0014 3.5v8a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-8A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v4a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v1.5A1.5 1.5 0 003.5 14h1a1.5 1.5 0 001.5-1.5v-1.5A1.5 1.5 0 004.5 10h-1zM3 3.5a1.5 1.5 0 113 0v1.5a1.5 1.5 0 11-3 0V3.5z" />
              </svg>
              Train Model
            </Link>
          </nav>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Recents
            </h3>
            <div className="space-y-1">
              {chats.map((chat) => (
                <Link
                  key={chat._id}
                  href={`/${chat._id}`}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeId === chat._id
                      ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.613C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                  <span className="truncate">{chat.title}</span>
                </Link>
              ))}
            </div>
            
             {chats.length === 0 && (
                <div className="mt-8 text-center px-4 text-xs text-zinc-400">
                    No chats yet. Start a new one!
                </div>
            )}
          </div>
          
           {/* User Profile / Logout (Optional wrapper) */}
           <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
             <div className="flex items-center gap-3 px-2">
                 <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                 <div className="flex flex-col">
                     <span className="text-xs font-medium text-zinc-900 dark:text-white">User</span>
                     <span className="text-[10px] text-zinc-500">Pro Plan</span>
                 </div>
             </div>
           </div>
        </div>
      </aside>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Chat"
      >
        <form onSubmit={handleCreateChat} className="space-y-6">
          <Input
            id="chatTitle"
            label="Chat Title"
            placeholder="e.g. Project Idea Brainstorming"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" disabled={loading} className="w-auto px-6">
              {loading ? "Creating..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Sidebar;
