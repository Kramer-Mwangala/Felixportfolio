"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui";
import { adminApi, Skill } from "@/lib/api";

interface SkillFormData {
  name: string;
  category: string;
  proficiency: number;
  color: string;
}

const categories = [
  { value: "design-tools", label: "Design Tools" },
  { value: "technical", label: "Technical Skills" },
  { value: "soft-skills", label: "Soft Skills" },
  { value: "other", label: "Other" },
];

export default function AdminSkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SkillFormData>();

  const fetchSkills = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      const res = await adminApi.getSkills(token);
      setSkills(res.skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const onSubmit = async (data: SkillFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (editing) {
        await adminApi.updateSkill(token, editing, data);
        toast.success("Skill updated");
      } else {
        await adminApi.createSkill(token, data);
        toast.success("Skill created");
      }
      fetchSkills();
      setShowForm(false);
      setEditing(null);
      reset();
    } catch (error) {
      toast.error("Failed to save skill");
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditing(skill._id);
    setValue("name", skill.name);
    setValue("category", skill.category);
    setValue("proficiency", skill.proficiency);
    setValue("color", skill.color || "#6366f1");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await adminApi.deleteSkill(token, id);
      setSkills(skills.filter((s) => s._id !== id));
      toast.success("Skill deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    reset();
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
            <h1 className="text-2xl font-bold">Skills</h1>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Skill
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Skill" : "New Skill"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Required" })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    placeholder="Adobe Photoshop"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    {...register("category", { required: "Required" })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Proficiency (%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register("proficiency", {
                      required: "Required",
                      min: 0,
                      max: 100,
                    })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    placeholder="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    {...register("color")}
                    className="w-full h-12 rounded-lg border border-border cursor-pointer"
                    defaultValue="#6366f1"
                  />
                </div>
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

        {/* Skills List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : skills.length > 0 ? (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="flex items-center justify-between p-4 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: skill.color || "#6366f1" }}
                  />
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {
                        categories.find((c) => c.value === skill.category)
                          ?.label
                      }{" "}
                      • {skill.proficiency}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-2 hover:bg-accent rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No skills yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
