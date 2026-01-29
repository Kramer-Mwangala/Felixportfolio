"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui";
import { adminApi, Experience } from "@/lib/api";

interface ExpFormData {
  type: "work" | "education";
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export default function AdminExperiencePage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"work" | "education">("work");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpFormData>();

  const isCurrent = watch("isCurrent");

  const fetchExperiences = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      const res = await adminApi.getExperience(token);
      setExperiences([...(res.work || []), ...(res.education || [])]);
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const filteredExperiences = experiences.filter(
    (exp) => exp.type === activeTab,
  );

  const onSubmit = async (data: ExpFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload: Partial<Experience> = {
        ...data,
        endDate: data.isCurrent ? undefined : data.endDate || undefined,
      };

      if (editing) {
        await adminApi.updateExperience(token, editing, payload);
        toast.success("Experience updated");
      } else {
        await adminApi.createExperience(token, payload);
        toast.success("Experience created");
      }
      fetchExperiences();
      handleCancel();
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditing(exp._id);
    setValue("type", exp.type);
    setValue("title", exp.title);
    setValue("organization", exp.organization);
    setValue("location", exp.location || "");
    setValue("startDate", exp.startDate.split("T")[0]);
    setValue("endDate", exp.endDate ? exp.endDate.split("T")[0] : "");
    setValue("isCurrent", exp.isCurrent);
    setValue("description", exp.description || "");
    setShowForm(true);
    setActiveTab(exp.type);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await adminApi.deleteExperience(token, id);
      setExperiences(experiences.filter((e) => e._id !== id));
      toast.success("Deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    reset();
  };

  const handleAddNew = () => {
    setValue("type", activeTab);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-accent rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Experience</h1>
          </div>
          {!showForm && (
            <Button onClick={handleAddNew}>
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("work")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "work"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Work
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "education"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Education
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit" : "New"}{" "}
              {activeTab === "work" ? "Work Experience" : "Education"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("type")} value={activeTab} />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {activeTab === "work" ? "Job Title" : "Degree/Program"} *
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: "Required" })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {activeTab === "work" ? "Company" : "Institution"} *
                  </label>
                  <input
                    type="text"
                    {...register("organization", { required: "Required" })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  {...register("location")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  placeholder="City, Country"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    {...register("startDate", { required: "Required" })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register("endDate")}
                    disabled={isCurrent}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isCurrent"
                  {...register("isCurrent")}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="isCurrent" className="text-sm">
                  {activeTab === "work"
                    ? "Currently working here"
                    : "Currently studying"}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none"
                  placeholder="Describe your role and achievements..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editing ? "Update" : "Create"}
                </Button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 hover:bg-accent rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredExperiences.length > 0 ? (
          <div className="space-y-4">
            {filteredExperiences.map((exp) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.organization}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exp.startDate).getFullYear()} -{" "}
                      {exp.isCurrent
                        ? "Present"
                        : exp.endDate
                          ? new Date(exp.endDate).getFullYear()
                          : ""}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-2 hover:bg-accent rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">
              No {activeTab} experience yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
