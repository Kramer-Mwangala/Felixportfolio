"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { adminApi, Project } from "@/lib/api";
import { getCategoryLabel } from "@/lib/utils";

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      const res = await adminApi.getProjects(token);
      setProjects(res.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeleting(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await adminApi.deleteProject(token, id);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-accent rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Projects</h1>
          </div>
          <Button href="/admin/projects/new">
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects Table */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium">Project</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">
                    Status
                  </th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <motion.tr
                    key={project._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-border"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 relative rounded overflow-hidden bg-muted flex-shrink-0">
                          {project.images[0]?.url ? (
                            <Image
                              src={project.images[0].url}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              🎨
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {getCategoryLabel(project.category)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="px-2 py-1 bg-accent rounded text-sm">
                        {getCategoryLabel(project.category)}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          project.featured
                            ? "bg-primary/10 text-primary"
                            : "bg-muted"
                        }`}
                      >
                        {project.featured ? "Featured" : "Standard"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/portfolio/${project.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-accent rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project._id}`}
                          className="p-2 hover:bg-accent rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
                          disabled={deleting === project._id}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button href="/admin/projects/new">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
