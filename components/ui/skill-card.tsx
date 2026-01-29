"use client";

import { motion } from "framer-motion";
import type { Skill } from "@/lib/api";

interface SkillCardProps {
  skill: Skill;
  index?: number;
}

export function SkillCard({ skill, index = 0 }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group bg-card p-5 rounded-2xl border border-border hover:border-primary/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold">{skill.name}</span>
        <span className="text-sm font-medium text-primary">
          {skill.proficiency}%
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          transition={{ duration: 1, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
        />
      </div>
    </motion.div>
  );
}

interface SkillBadgeProps {
  skill: Skill;
  index?: number;
}

export function SkillBadge({ skill, index = 0 }: SkillBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="px-5 py-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <span className="w-2 h-2 rounded-full bg-primary" />
      {skill.name}
    </motion.div>
  );
}
