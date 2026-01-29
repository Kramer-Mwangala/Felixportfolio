"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button, ProjectCard, SectionHeader } from "@/components/ui";
import { api, Project, Profile } from "@/lib/api";
import { getCdnUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          api.getProfile(),
          api.getProjects({ featured: "true", limit: 4 }),
        ]);
        setProfile(profileRes.profile);
        setProjects(projectsRes.projects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 flex-1"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                WELCOME TO PORTFOLIO
                <Sparkles className="w-4 h-4" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                WELCOME TO
                <br />
                MY PORTFOLIO
                <br />I AM{" "}
                <span className="bg-primary text-primary-foreground px-3 py-1 inline-block">
                  FELIX
                </span>
              </h1>

              <p className="text-lg text-white/70 mb-8 max-w-lg">
                Award-winning graphic designer based in Nairobi.
              </p>

              <Button href="/portfolio" size="lg" className="group">
                View My Work
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative hidden lg:flex items-end justify-end flex-shrink-0"
            >
              {/* Profile Image */}
              <div className="relative w-[450px] h-[550px]">
                <Image
                  src={getCdnUrl("profile2.png")}
                  alt="Felix"
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Some of my project"
            subtitle="A selection of my recent design projects showcasing creativity and attention to detail."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/portfolio" variant="outline" size="lg">
              View All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Let's Create Something Amazing Together
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Have a project in mind? I'd love to hear about it. Let's discuss
              how we can bring your vision to life.
            </p>
            <Button href="/contact" size="lg">
              Let's Talk
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
