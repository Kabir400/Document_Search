"use client";

import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";


export default function Dashboard() {
    const router = useRouter();


  useEffect(() => {
   
    const token=localStorage.getItem("authToken");
    if(!token){
        router.push("/login");
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* Sidebar - Always present if logged in (or we can conditionally render) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 transition-all md:ml-64">
        <div className="flex h-screen flex-col items-center justify-center p-8 text-center">
            
            <div className="mb-8 relative">
                 <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full" />
                 <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-tr from-black to-zinc-800 p-4 shadow-xl dark:from-white dark:to-zinc-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white dark:text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                 </div>
            </div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
            How can I help you today?
          </h1>
          <p className="max-w-md text-lg text-zinc-500 dark:text-zinc-400">
            Select a chat from the sidebar or create a new one to get started. 
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl w-full">
            {[
                "What is the leave policy in our company?",
                "How many leaves can I take in a month?",
                "Is 25th Dec a holiday in our company?",
                "How do I submit an expense reimbursement?"
            ].map((text, i) => (
                <button key={i} className="group relative rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all hover:border-black/20 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-white/20">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
                        {text}
                    </span>
                </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
