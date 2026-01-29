"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getCdnUrl } from "@/lib/utils";

// Static skills data
const skills = [
  { name: "Blender", score: 9, color: "from-orange-500 to-orange-600" },
  { name: "Illustrator", score: 8, color: "from-orange-400 to-yellow-500" },
  { name: "Photoshop", score: 7, color: "from-blue-500 to-blue-600" },
  { name: "After Effects", score: 5, color: "from-purple-500 to-purple-600" },
  { name: "Video Editing", score: 7, color: "from-pink-500 to-rose-500" },
  { name: "Photography", score: 5, color: "from-teal-500 to-cyan-500" },
];

function SkillScoreCard({
  skill,
  index,
}: {
  skill: (typeof skills)[0];
  index: number;
}) {
  const percentage = (skill.score / 10) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">{skill.name}</h3>
        <div className="flex items-center gap-1">
          <span className="text-3xl font-bold text-primary">{skill.score}</span>
          <span className="text-lg text-muted-foreground">/10</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
          viewport={{ once: true }}
          className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
        />
      </div>

      {/* Score Dots */}
      <div className="flex gap-1.5 justify-center">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.1 + i * 0.05 }}
            viewport={{ once: true }}
            className={`w-3 h-3 rounded-full ${
              i < skill.score ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsPage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="bg-secondary text-white pt-32 pb-20"
        style={{
          backgroundImage: `url('${getCdnUrl("background.png")}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
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
              MY EXPERTISE
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Skills &{" "}
              <span className="bg-primary text-primary-foreground px-3 py-1 inline-block">
                Expertise
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              A comprehensive overview of my technical abilities and creative
              tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skills Scorecards Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">My Skillset</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Proficiency levels in the tools and techniques I use to bring
              creative visions to life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <SkillScoreCard key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
