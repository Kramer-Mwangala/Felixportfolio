"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Dribbble,
  Twitter,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";
import { api, Profile } from "@/lib/api";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const socialIcons: Record<string, React.ElementType> = {
  linkedin: Linkedin,
  instagram: Instagram,
  dribbble: Dribbble,
  twitter: Twitter,
};

export default function ContactPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getProfile();
        setProfile(res.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await api.sendMessage(data);
      toast.success("Message sent successfully! I'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-secondary text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              GET IN TOUCH
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let&apos;s{" "}
              <span className="bg-primary text-primary-foreground px-3 py-1 inline-block">
                Work Together
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Have a project in mind? Let&apos;s work together to bring your
              ideas to life.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register("subject")}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Project inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message", {
                      required: "Message is required",
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Info Cards */}
              <div className="bg-secondary text-white rounded-2xl p-8">
                <h3 className="font-semibold text-xl mb-6">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-4 text-white/80 hover:text-primary transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile?.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-4 text-white/80 hover:text-primary transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <span>{profile.phone}</span>
                    </a>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-4 text-white/80">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <span>
                        {profile.location.city}, {profile.location.country}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Links inside the card */}
                {profile?.socialLinks && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="font-medium text-lg mb-4">Follow Me</h4>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(profile.socialLinks).map(
                        ([key, value]) => {
                          if (!value) return null;
                          const Icon = socialIcons[key];
                          if (!Icon) return null;
                          return (
                            <a
                              key={key}
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Icon className="w-5 h-5" />
                            </a>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Availability */}
              {profile?.availability?.isAvailable && (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="font-medium text-primary">
                      Currently available for new projects
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
