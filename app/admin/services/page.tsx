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
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui";
import { adminApi, Service } from "@/lib/api";

interface ServiceFormData {
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string;
  priceRange: string;
  order: number;
  isActive: boolean;
}

const iconOptions = [
  "🎨",
  "✏️",
  "📱",
  "💻",
  "📦",
  "🖼️",
  "✨",
  "🔧",
  "📝",
  "🎯",
];

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>();

  const fetchServices = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      const res = await adminApi.getServices(token);
      setServices(res.services || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = {
        ...data,
        features: data.features.split("\n").filter((f) => f.trim()),
      };

      if (editing) {
        await adminApi.updateService(token, editing, payload);
        toast.success("Updated");
      } else {
        await adminApi.createService(token, payload);
        toast.success("Created");
      }
      fetchServices();
      handleCancel();
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  const handleEdit = (s: Service) => {
    setEditing(s._id);
    setValue("title", s.title);
    setValue("description", s.description);
    setValue("shortDescription", s.shortDescription || "");
    setValue("icon", s.icon || "🎨");
    setValue("features", s.features?.join("\n") || "");
    setValue("priceRange", s.priceRange || "");
    setValue("order", s.order || 0);
    setValue("isActive", s.isActive !== false);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await adminApi.deleteService(token, id);
      setServices(services.filter((s) => s._id !== id));
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
            <h1 className="text-2xl font-bold">Services</h1>
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
              {editing ? "Edit" : "New"} Service
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: "Required" })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    placeholder="Logo Design"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {iconOptions.map((icon) => (
                      <label key={icon} className="cursor-pointer">
                        <input
                          type="radio"
                          value={icon}
                          {...register("icon")}
                          className="sr-only peer"
                        />
                        <span className="w-10 h-10 flex items-center justify-center text-xl bg-background border border-border rounded-lg peer-checked:border-primary peer-checked:bg-primary/10">
                          {icon}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  {...register("shortDescription")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  placeholder="Brief one-liner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Description *
                </label>
                <textarea
                  rows={3}
                  {...register("description", { required: "Required" })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Features (one per line)
                </label>
                <textarea
                  rows={4}
                  {...register("features")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none"
                  placeholder="Custom designs&#10;Unlimited revisions&#10;Source files included"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <input
                    type="text"
                    {...register("priceRange")}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    placeholder="$500 - $2,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    {...register("order", { valueAsNumber: true })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  defaultChecked
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="isActive" className="text-sm">
                  Active (visible on website)
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
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="space-y-4">
            {services.map((s) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`bg-card border border-border rounded-xl p-4 ${!s.isActive ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      {s.icon || "🎨"}
                    </div>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {s.shortDescription || s.description}
                      </p>
                      {s.priceRange && (
                        <p className="text-sm text-primary mt-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {s.priceRange}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(s)}
                      className="p-2 hover:bg-accent rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
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
            <p className="text-muted-foreground">No services yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
