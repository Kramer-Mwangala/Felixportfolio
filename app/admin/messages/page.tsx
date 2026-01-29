"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Trash2, Mail, Clock, Check, X } from "lucide-react";
import { adminApi, Message } from "@/lib/api";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      const res = await adminApi.getMessages(token);
      setMessages(res.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await adminApi.markMessageRead(token, id);
      setMessages(
        messages.map((m) => (m._id === id ? { ...m, isRead: true } : m)),
      );
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (error) {
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await adminApi.deleteMessage(token, id);
      setMessages(messages.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Messages List */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border bg-card overflow-y-auto">
          <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-accent rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold">Messages</h1>
            </div>
          </div>

          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div>
              {messages.map((message) => (
                <motion.button
                  key={message._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) markAsRead(message._id);
                  }}
                  className={`w-full text-left p-4 border-b border-border hover:bg-accent transition-colors ${
                    selectedMessage?._id === message._id ? "bg-accent" : ""
                  } ${!message.isRead ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-medium truncate pr-2">
                      {!message.isRead && (
                        <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2" />
                      )}
                      {message.name}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {message.subject || "No subject"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(message.createdAt)}
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No messages yet
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedMessage.subject || "No subject"}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    From: {selectedMessage.name} ({selectedMessage.email})
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="p-2 hover:bg-accent rounded-lg"
                    title="Reply"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Clock className="w-4 h-4" />
                  {formatDate(selectedMessage.createdAt)}
                  {selectedMessage.isRead ? (
                    <span className="flex items-center gap-1 ml-4 text-green-500">
                      <Check className="w-4 h-4" /> Read
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 ml-4 text-primary">
                      New
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
