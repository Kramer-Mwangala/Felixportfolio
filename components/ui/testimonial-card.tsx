"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { CloudinaryImage } from "./cloudinary-image";
import type { Testimonial } from "@/lib/api";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export function TestimonialCard({
  testimonial,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 border border-border relative hover:border-primary/30 hover:shadow-lg transition-all group"
    >
      {/* Quote Icon */}
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
        <Quote className="w-5 h-5 text-primary-foreground" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? "text-primary fill-primary"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-muted-foreground mb-6 leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {testimonial.avatar?.url ? (
          <CloudinaryImage
            src={testimonial.avatar.url}
            alt={testimonial.clientName}
            width={48}
            height={48}
            className="rounded-full object-cover"
            crop="thumb"
            gravity="face"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
            {testimonial.clientName.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-semibold">{testimonial.clientName}</h4>
          <p className="text-sm text-muted-foreground">
            {testimonial.clientTitle}
            {testimonial.company && ` at ${testimonial.company}`}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
