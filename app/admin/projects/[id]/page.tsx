"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, X, Upload } from "lucide-react";
import { Button } from "@/components/ui";
import { adminApi, Project } from "@/lib/api";

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  tools: string;
  tags: string;
  clientName: string;
  clientWebsite: string;
  featured: boolean;
}

const categories = [
  { value: "branding", label: "Branding" },
  { value: "logo-design", label: "Logo Design" },
  { value: "ui-ux", label: "UI/UX" },
  { value: "posters", label: "Posters" },
  { value: "social-media", label: "Social Media" },
  { value: "illustration", label: "Illustration" },
  { value: "packaging", label: "Packaging" },
  { value: "other", label: "Other" },
];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    { url: string; publicId?: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>();

  const fetchProject = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      const res = await adminApi.getProject(token, params.id as string);
      setProject(res.project);
      setExistingImages(res.project.images || []);
      reset({
        title: res.project.title,
        description: res.project.description,
        category: res.project.category,
        tools: res.project.tools?.join(", ") || "",
        tags: res.project.tags?.join(", ") || "",
        clientName: res.project.client?.name || "",
        clientWebsite: res.project.client?.website || "",
        featured: res.project.featured,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to fetch project");
      router.push("/admin/projects");
    } finally {
      setLoading(false);
    }
  }, [params.id, router, reset]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages([...newImages, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setNewImageUrls([...newImageUrls, ...urls]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImageUrls[index]);
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImageUrls(newImageUrls.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tools", data.tools);
      formData.append("tags", data.tags);
      formData.append("featured", String(data.featured));
      formData.append("existingImages", JSON.stringify(existingImages));

      if (data.clientName) {
        formData.append("client[name]", data.clientName);
        if (data.clientWebsite) {
          formData.append("client[website]", data.clientWebsite);
        }
      }

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      await adminApi.updateProject(token, params.id as string, formData);
      toast.success("Project updated successfully!");
      router.push("/admin/projects");
    } catch (error) {
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/projects"
            className="p-2 hover:bg-accent rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Edit Project</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                rows={5}
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tools Used
              </label>
              <input
                type="text"
                {...register("tools")}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Photoshop, Illustrator (comma-separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                {...register("tags")}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="logo, minimal (comma-separated)"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  {...register("clientName")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client Website
                </label>
                <input
                  type="url"
                  {...register("clientWebsite")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                {...register("featured")}
                className="w-5 h-5 rounded border-border"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured project
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {existingImages.map((img, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {newImageUrls.map((url, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Link
              href="/admin/projects"
              className="px-6 py-3 hover:bg-accent rounded-lg"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
