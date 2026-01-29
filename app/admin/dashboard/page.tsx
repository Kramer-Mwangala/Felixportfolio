"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Palette,
  Briefcase,
  MessageSquare,
  Quote,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import {
  adminApi,
  Project,
  Skill,
  Testimonial,
  Message,
  Service,
} from "@/lib/api";

interface DashboardStats {
  projects: number;
  skills: number;
  testimonials: number;
  messages: number;
  services: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }

      // Fetch counts
      const [
        projectsRes,
        skillsRes,
        testimonialsRes,
        messagesRes,
        servicesRes,
      ] = await Promise.all([
        adminApi.getProjects(token),
        adminApi.getSkills(token),
        adminApi.getTestimonials(token),
        adminApi.getMessages(token),
        adminApi.getServices(token),
      ]);

      setStats({
        projects: projectsRes.projects?.length || 0,
        skills: skillsRes.skills?.length || 0,
        testimonials: testimonialsRes.testimonials?.length || 0,
        messages: messagesRes.messages?.length || 0,
        services: servicesRes.services?.length || 0,
        unreadMessages:
          messagesRes.messages?.filter((m: Message) => !m.isRead).length || 0,
      });

      setRecentMessages(messagesRes.messages?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      localStorage.removeItem("token");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Skills", href: "/admin/skills", icon: Palette },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Services", href: "/admin/services", icon: Settings },
    { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      badge: stats?.unreadMessages,
    },
    { name: "Profile", href: "/admin/profile", icon: Users },
  ];

  const statCards = [
    {
      label: "Projects",
      value: stats?.projects || 0,
      icon: FolderKanban,
      color: "bg-blue-500",
    },
    {
      label: "Skills",
      value: stats?.skills || 0,
      icon: Palette,
      color: "bg-green-500",
    },
    {
      label: "Testimonials",
      value: stats?.testimonials || 0,
      icon: Quote,
      color: "bg-purple-500",
    },
    {
      label: "Messages",
      value: stats?.messages || 0,
      icon: MessageSquare,
      color: "bg-orange-500",
    },
    {
      label: "Services",
      value: stats?.services || 0,
      icon: Settings,
      color: "bg-pink-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-accent rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-accent transition-colors ${
                item.href === "/admin/dashboard"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.name}
              </div>
              {item.badge ? (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-accent text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-accent rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            View Site →
          </Link>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div
                  className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white mb-3`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Messages</h3>
              <Link
                href="/admin/messages"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`p-4 rounded-lg border ${
                      message.isRead
                        ? "border-border bg-background"
                        : "border-primary bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {message.email}
                        </div>
                      </div>
                      {!message.isRead && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No messages yet
              </p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
