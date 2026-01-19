"use client";

import React, { use } from "react";
import Sidebar from "../../components/Sidebar";
import ChatArea from "../../components/ChatArea";

export default function ChatPage({ params }) {
  // In Next.js 15+, params is a promise
  const resolvedParams = use(params);

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <Sidebar />
      <main className="flex-1 transition-all md:ml-64">
        <ChatArea chatId={resolvedParams.id} />
      </main>
    </div>
  );
}
