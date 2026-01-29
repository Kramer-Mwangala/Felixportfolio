"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TestimonialCard } from "@/components/ui";
import { api, Testimonial } from "@/lib/api";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.getTestimonials();
        setTestimonials(res.testimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

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
              CLIENT FEEDBACK
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              What Clients{" "}
              <span className="bg-primary text-primary-foreground px-3 py-1 inline-block">
                Say
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Kind words from clients I&apos;ve had the pleasure of working
              with.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
