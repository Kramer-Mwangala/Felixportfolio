"use client";

import { motion } from "framer-motion";
import { CloudinaryImage } from "./cloudinary-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/api";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const primaryImage =
    project.images.find((img) => img.isPrimary) || project.images[0];

  // Prioritize first 4 images (above the fold)
  const shouldPrioritize = index < 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/portfolio/${project.slug}`}>
        <motion.article whileHover={{ y: -4 }} className="group">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
            {primaryImage ? (
              <CloudinaryImage
                src={primaryImage.url}
                alt={primaryImage.alt || project.title}
                fill
                priority={shouldPrioritize}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                crop="fill"
                gravity="auto"
                quality="auto"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-50 to-gray-100">
                🎨
              </div>
            )}

            {/* Arrow Button */}
            <div className="absolute top-2 right-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
              >
                <ArrowUpRight className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-xs line-clamp-2">
              {project.shortDescription || project.description}
            </p>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
