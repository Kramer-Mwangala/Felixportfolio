"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download, MapPin, Mail, Phone, Sparkles } from "lucide-react";
import { Button, SectionHeader, TimelineItem } from "@/components/ui";
import { api, Profile, Experience } from "@/lib/api";
import { getCdnUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [work, setWork] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, expRes] = await Promise.all([
          api.getProfile(),
          api.getExperience(),
        ]);
        setProfile(profileRes.profile);
        setWork(expRes.work);
        setEducation(expRes.education);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-secondary text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
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
                ABOUT ME
                <Sparkles className="w-4 h-4" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                I am{" "}
                <span className="bg-primary text-primary-foreground px-3 py-1 inline-block">
                  Felix Okoth
                </span>
              </h1>
              <h2 className="text-xl text-primary font-medium mb-6">
                Animator, Graphics & 3D Artist
              </h2>

              <p className="text-white/70 mb-6 leading-relaxed text-lg">
                A passionate artist and a gamer too. My zeal for creation and
                problem solving has really shaped and influenced my venture into
                being an Animator, Graphics and 3D Artist. Over time, I
                developed a fervent dedication to crafting immersive visual
                experiences that captivate and inspire audiences.
              </p>

              <p className="text-white/70 mb-6 leading-relaxed text-lg">
                Seeking to leverage my expertise in animation and cutting-edge
                3D design to contribute creatively to dynamic projects that push
                the boundaries of storytelling and visual expression. Committed
                to continuous learning and innovation, I aim to collaborate with
                visionary teams to bring imagination to life in unforgettable
                ways.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                {profile?.location && (
                  <div className="flex items-center gap-3 text-white/80">
                    <MapPin className="w-5 h-5 text-primary" />
                    {profile.location.city}, {profile.location.country}
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-3 text-white/80">
                    <Mail className="w-5 h-5 text-primary" />
                    {profile.email}
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-3 text-white/80">
                    <Phone className="w-5 h-5 text-primary" />
                    {profile.phone}
                  </div>
                )}
              </div>

              {profile?.resumeUrl && (
                <Button href={profile.resumeUrl} size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download CV
                </Button>
              )}
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="relative z-10 w-[320px] h-[400px]">
                <Image
                  src={getCdnUrl("profile2.png")}
                  alt="Felix Okoth"
                  fill
                  className="object-cover object-top rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Work Experience */}
          {work.length > 0 && (
            <div className="mb-20">
              <SectionHeader
                title="Work Experience"
                subtitle="My professional journey in the design industry."
                centered={false}
              />
              <div className="max-w-3xl">
                {work.map((exp, index) => (
                  <TimelineItem
                    key={exp._id}
                    experience={exp}
                    index={index}
                    isLast={index === work.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <SectionHeader
                title="Education"
                subtitle="My academic background and certifications."
                centered={false}
              />
              <div className="max-w-3xl">
                {education.map((exp, index) => (
                  <TimelineItem
                    key={exp._id}
                    experience={exp}
                    index={index}
                    isLast={index === education.length - 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
