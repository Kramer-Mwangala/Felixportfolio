"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Save, Star } from "lucide-react";
import { Button } from "@/components/ui";
import { adminApi, Testimonial } from "@/lib/api";

interface TestimonialFormData {
  clientName: string;
  clientTitle: string;
  company: string;
  content: string;
  rating: number;
  featured: boolean;
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TestimonialFormData>();

  const fetchTestimonials = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      const res = await adminApi.getTestimonials(token);
      setTestimonials(res.testimonials || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (editing) {
        await adminApi.updateTestimonial(token, editing, data);
        toast.success("Updated");
      } else {
        await adminApi.createTestimonial(token, data);
        toast.success("Created");
      }
      fetchTestimonials();
      handleCancel();
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t._id);
    setValue("clientName", t.clientName);
    setValue("clientTitle", t.clientTitle || "");
    setValue("company", t.company || "");
    setValue("content", t.content);
    setValue("rating", t.rating);
    setValue("featured", t.featured || false);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await adminApi.deleteTestimonial(token, id);
      setTestimonials(testimonials.filter((t) => t._id !== id));
      toast.success("Deleted");
    } catch (error) {
      toast.error("Failed");
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
            <h1 className="text-2xl font-bold">Testimonials</h1>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          )}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit" : "New"} Testimonial
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    {...register("clientName", { required: "Required" })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Client Title
                  </label>
                  <input
                    type="text"
                    {...register("clientTitle")}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    placeholder="CEO, Founder, etc."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    {...register("company")}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rating *
                  </label>
                  <select
                    {...register("rating", {
                      required: "Required",
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Testimonial Content *
                </label>
                <textarea
                  rows={4}
                  {...register("content", { required: "Required" })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none"
                  placeholder="What did the client say?"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  {...register("featured")}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="featured" className="text-sm">
                  Featured (show on homepage)
                </label>
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

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{t.clientName}</h3>
                      {t.featured && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t.clientTitle}
                      {t.company && ` at ${t.company}`}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < t.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {t.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(t)}
                      className="p-2 hover:bg-accent rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
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
            <p className="text-muted-foreground">No testimonials yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
