"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui";
import { adminApi } from "@/lib/api";

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

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...urls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]);
    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tools", data.tools);
      formData.append("tags", data.tags);
      formData.append("featured", String(data.featured));

      if (data.clientName) {
        formData.append("client[name]", data.clientName);
        if (data.clientWebsite) {
          formData.append("client[website]", data.clientWebsite);
        }
      }

      images.forEach((image) => {
        formData.append("images", image);
      });

      await adminApi.createProject(token, formData);
      toast.success("Project created successfully!");
      router.push("/admin/projects");
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/projects"
            className="p-2 hover:bg-accent rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">New Project</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Project title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
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
                placeholder="Describe the project..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Tools */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tools Used
              </label>
              <input
                type="text"
                {...register("tools")}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Photoshop, Illustrator, Figma (comma-separated)"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                {...register("tags")}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="logo, minimalist, corporate (comma-separated)"
              />
            </div>

            {/* Client */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  {...register("clientName")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client Website
                </label>
                <input
                  type="url"
                  {...register("clientWebsite")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                {...register("featured")}
                className="w-5 h-5 rounded border-border"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured project (shown on homepage)
              </label>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Add Image
                  </span>
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

          {/* Submit */}
          <div className="flex items-center gap-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
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
