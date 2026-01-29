"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";
import { formatDateRange } from "@/lib/utils";
import type { Experience } from "@/lib/api";

interface TimelineItemProps {
  experience: Experience;
  index?: number;
  isLast?: boolean;
}

export function TimelineItem({
  experience,
  index = 0,
  isLast = false,
}: TimelineItemProps) {
  const Icon = experience.type === "work" ? Briefcase : GraduationCap;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative pl-8 pb-8"
    >
      {/* Line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />
      )}

      {/* Dot */}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
        <Icon className="w-3 h-3 text-primary-foreground" />
      </div>

      {/* Content */}
      <div className="bg-card rounded-lg p-5 border border-border">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg">{experience.title}</h3>
          {experience.isCurrent && (
            <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
              Current
            </span>
          )}
        </div>

        <p className="text-primary font-medium mb-2">
          {experience.organization}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDateRange(
              experience.startDate,
              experience.endDate,
              experience.isCurrent,
            )}
          </span>
          {experience.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {experience.location}
            </span>
          )}
        </div>

        {experience.description && (
          <p className="text-muted-foreground text-sm mb-3">
            {experience.description}
          </p>
        )}

        {experience.achievements && experience.achievements.length > 0 && (
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {experience.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
