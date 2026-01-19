"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function TrainAiPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/get-documents", {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (data.suceess) {
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/v1/upload", {
        method: "POST",
        headers: getAuthHeaders(), // Content-Type is set automatically for FormData
        body: formData,
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (data.suceess) {
        // Add new document to list
        setDocuments((prev) => [data.data.document, ...prev]);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/delete-document/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (data.suceess) {
        setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <Sidebar />
      <main className="flex-1 transition-all md:ml-64 p-8">
        <div className="mx-auto max-w-5xl">
            {/* Header Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Knowledge Base
              </h1>
              <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                Manage documents to train your AI assistant.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,.docx,.md"
              />
              <Button onClick={handleUploadClick} disabled={uploading}>
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Upload Document
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Table / List Section */}
          <Card className="!max-w-none overflow-hidden !p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                    <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Document Name</th>
                            <th className="px-6 py-4 font-medium">Date Uploaded</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {loading ? (
                             <tr>
                                <td colSpan="3" className="px-6 py-8 text-center">
                                    <div className="flex justify-center">
                                         <div className="animate-pulse h-2 w-24 bg-zinc-200 rounded dark:bg-zinc-800"></div>
                                    </div>
                                </td>
                             </tr>
                        ) : documents.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-zinc-300 dark:text-zinc-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                        <p className="text-zinc-500 dark:text-zinc-500">No documents found. Upload one to get started.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
                                <tr key={doc._id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-200">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                            </div>
                                            {doc.originalName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{formatDate(doc.createdAt)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(doc._id)}
                                            className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                            title="Delete Document"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
