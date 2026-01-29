"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui";
import { adminApi } from "@/lib/api";

interface ProfileFormData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin: string;
  instagram: string;
  dribbble: string;
  twitter: string;
  behance: string;
  resumeUrl: string;
  isAvailable: boolean;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { register, handleSubmit, reset } = useForm<ProfileFormData>();

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      const res = await adminApi.getProfile(token);
      const p = res.profile;
      if (p) {
        reset({
          name: p.name || "",
          title: p.title || "",
          bio: p.bio || "",
          email: p.email || "",
          phone: p.phone || "",
          city: p.location?.city || "",
          country: p.location?.country || "",
          linkedin: p.socialLinks?.linkedin || "",
          instagram: p.socialLinks?.instagram || "",
          dribbble: p.socialLinks?.dribbble || "",
          twitter: p.socialLinks?.twitter || "",
          behance: p.socialLinks?.behance || "",
          resumeUrl: p.resumeUrl || "",
          isAvailable: p.availability?.isAvailable ?? true,
        });
        if (p.avatar?.url) {
          setAvatarPreview(p.avatar.url);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router, reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("title", data.title);
      formData.append("bio", data.bio);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("location[city]", data.city);
      formData.append("location[country]", data.country);
      formData.append("socialLinks[linkedin]", data.linkedin);
      formData.append("socialLinks[instagram]", data.instagram);
      formData.append("socialLinks[dribbble]", data.dribbble);
      formData.append("socialLinks[twitter]", data.twitter);
      formData.append("socialLinks[behance]", data.behance);
      formData.append("resumeUrl", data.resumeUrl);
      formData.append("availability[isAvailable]", String(data.isAvailable));

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await adminApi.updateProfile(token, formData);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
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
            href="/admin/dashboard"
            className="p-2 hover:bg-accent rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted">
                {avatarPreview ? (
                  <>
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Required" })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Professional Title *
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Required" })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  placeholder="Graphic Designer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                rows={4}
                {...register("bio")}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none"
                placeholder="Tell visitors about yourself..."
              />
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Contact Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Required" })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  {...register("city")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  {...register("country")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Social Links</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  {...register("linkedin")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  {...register("instagram")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Dribbble
                </label>
                <input
                  type="url"
                  {...register("dribbble")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  placeholder="https://dribbble.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Behance
                </label>
                <input
                  type="url"
                  {...register("behance")}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  placeholder="https://behance.net/..."
                />
              </div>
            </div>
          </div>

          {/* Resume & Availability */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Resume & Availability</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Resume URL
              </label>
              <input
                type="url"
                {...register("resumeUrl")}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                placeholder="https://drive.google.com/... or direct link to PDF"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isAvailable"
                {...register("isAvailable")}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="isAvailable" className="text-sm">
                Currently available for new projects (shows availability badge)
              </label>
            </div>
          </div>

          {/* Save Button */}
          <Button type="submit" size="lg" disabled={saving}>
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
