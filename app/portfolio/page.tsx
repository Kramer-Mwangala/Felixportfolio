"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, Play, X } from "lucide-react";
import { ProjectCard } from "@/components/ui";
import { api, Project } from "@/lib/api";
import { getCdnUrl } from "@/lib/utils";

// Modal component for viewing images and videos
function MediaModal({
  isOpen,
  onClose,
  src,
  title,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  title: string;
  type: "image" | "video";
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
        >
          <X className="w-6 h-6" />
        </button>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-3xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {type === "image" ? (
            <img
              src={src}
              alt={title}
              className="w-full h-auto object-contain rounded-lg"
            />
          ) : (
            <video
              src={src}
              controls
              autoPlay
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          )}
          <p className="text-white text-center mt-4 font-medium">{title}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const categories = [
  { value: "", label: "All" },
  { value: "3d-creation", label: "3D Creation" },
  { value: "animations", label: "Animations" },
  { value: "digital-posts", label: "Digital Posts" },
  { value: "video-and-reels", label: "Video and Reels" },
];

// Static animations from CDN
const staticAnimations = [
  { title: "Jasmine 1", src: getCdnUrl("ANIMATIONS/Jasmine 1.mp4") },
  {
    title: "KETEPA PRIDE CUT 2",
    src: getCdnUrl("ANIMATIONS/KETEPA PRIDE CUT 2.mp4"),
  },
  { title: "TIABE TOWN", src: getCdnUrl("ANIMATIONS/TIABE TOWN.mp4") },
];

// Static digital posts from CDN
const staticDigitalPosts = {
  images: [
    { title: "Artboard 1", src: getCdnUrl("DIGITAL POSTS/Artboard 1.png") },
    { title: "Artboard 2", src: getCdnUrl("DIGITAL POSTS/Artboard 2.png") },
    { title: "KV 1", src: getCdnUrl("DIGITAL POSTS/KV 1.png") },
    { title: "KV 2", src: getCdnUrl("DIGITAL POSTS/KV 2.png") },
    {
      title: "The Golf Park Invite III",
      src: getCdnUrl("DIGITAL POSTS/The-Golf-Park-Invite-III.png"),
    },
    { title: "Claudia", src: getCdnUrl("DIGITAL POSTS/posters/claudia.png") },
    { title: "Duos", src: getCdnUrl("DIGITAL POSTS/posters/duos.png") },
    { title: "FIK", src: getCdnUrl("DIGITAL POSTS/posters/FIK.png") },
  ],
  videos: [
    {
      title: "The Golf Park Invite 3",
      src: getCdnUrl("DIGITAL POSTS/The Golf Park Invite 3.mp4"),
    },
    {
      title: "Best Cream",
      src: getCdnUrl("DIGITAL POSTS/BEST/Best cream.mp4"),
    },
    {
      title: "Best Gin 2",
      src: getCdnUrl("DIGITAL POSTS/BEST/Best gin 2.mp4"),
    },
    { title: "Best Gin", src: getCdnUrl("DIGITAL POSTS/BEST/Best gin.mp4") },
    {
      title: "Best Vodka",
      src: getCdnUrl("DIGITAL POSTS/BEST/Best vodka.mp4"),
    },
    {
      title: "Best Whisky",
      src: getCdnUrl("DIGITAL POSTS/BEST/Best whisky.mp4"),
    },
  ],
};

// Static 3D creations from CDN
const static3DCreations = {
  activationSetups: [
    {
      title: "Delamere Booth",
      src: getCdnUrl(
        "3D/3D CREATION/ACTIVATION SET UPS/DELAMERE/booth FRONT.png",
      ),
      category: "Delamere",
    },
    {
      title: "Delamere Front",
      src: getCdnUrl(
        "3D/3D CREATION/ACTIVATION SET UPS/DELAMERE/booth SIDE.png",
      ),
      category: "Delamere",
    },
    {
      title: "Home and Beyond 1",
      src: getCdnUrl(
        "3D/3D CREATION/ACTIVATION SET UPS/HOME AND BEYOND/1png.png",
      ),
      category: "Home and Beyond",
    },
    {
      title: "Home and Beyond 2",
      src: getCdnUrl("3D/3D CREATION/ACTIVATION SET UPS/HOME AND BEYOND/2.png"),
      category: "Home and Beyond",
    },
    {
      title: "Jambojet 1",
      src: getCdnUrl("3D/3D CREATION/ACTIVATION SET UPS/JAMBOJET/1.png"),
      category: "Jambojet",
    },
    {
      title: "Jambojet 2",
      src: getCdnUrl("3D/3D CREATION/ACTIVATION SET UPS/JAMBOJET/2.png"),
      category: "Jambojet",
    },
    {
      title: "Rubis 1",
      src: getCdnUrl("3D/3D CREATION/ACTIVATION SET UPS/RUBIS/1.png"),
      category: "Rubis",
    },
    {
      title: "Rubis 2",
      src: getCdnUrl("3D/3D CREATION/ACTIVATION SET UPS/RUBIS/2.png"),
      category: "Rubis",
    },
    {
      title: "Serena Prestige Club 1",
      src: getCdnUrl(
        "3D/3D CREATION/ACTIVATION SET UPS/SERENA PRESTIGE CLUB/1.png",
      ),
      category: "Serena Prestige Club",
    },
    {
      title: "Serena Prestige Club 2",
      src: getCdnUrl(
        "3D/3D CREATION/ACTIVATION SET UPS/SERENA PRESTIGE CLUB/2.png",
      ),
      category: "Serena Prestige Club",
    },
  ],
  events: [
    {
      title: "Golden Africa 1",
      src: getCdnUrl("3D/3D CREATION/EVENTS/GOLDEN AFRICA/File 1.png"),
      category: "Golden Africa",
    },
    {
      title: "Golden Africa 2",
      src: getCdnUrl("3D/3D CREATION/EVENTS/GOLDEN AFRICA/File 2.png"),
      category: "Golden Africa",
    },
    {
      title: "Indomie 1",
      src: getCdnUrl("3D/3D CREATION/EVENTS/INDOMIE/1.png"),
      category: "Indomie",
    },
    {
      title: "Indomie 2",
      src: getCdnUrl("3D/3D CREATION/EVENTS/INDOMIE/2.png"),
      category: "Indomie",
    },
    {
      title: "Jambojet Event 1",
      src: getCdnUrl("3D/3D CREATION/EVENTS/JAMBOJET 2/1.png"),
      category: "Jambojet",
    },
    {
      title: "Jambojet Event 2",
      src: getCdnUrl("3D/3D CREATION/EVENTS/JAMBOJET 2/2.png"),
      category: "Jambojet",
    },
    {
      title: "Shaka Ilembe Entry",
      src: getCdnUrl("3D/3D CREATION/EVENTS/SHAKA ILEMBE/entry.png"),
      category: "Shaka Ilembe",
    },
    {
      title: "Shaka Ilembe Front",
      src: getCdnUrl("3D/3D CREATION/EVENTS/SHAKA ILEMBE/front.png"),
      category: "Shaka Ilembe",
    },
  ],
  posms: [
    {
      title: "Black and Decker 5",
      src: getCdnUrl("3D/3D CREATION/POSMs/BLACK AND DECKER/5.png"),
      category: "Black and Decker",
    },
    {
      title: "Black and Decker 6",
      src: getCdnUrl("3D/3D CREATION/POSMs/BLACK AND DECKER/6.png"),
      category: "Black and Decker",
    },
    {
      title: "Brookside 3",
      src: getCdnUrl("3D/3D CREATION/POSMs/BROOKSIDE/3.png"),
      category: "Brookside",
    },
    {
      title: "Brookside 4",
      src: getCdnUrl("3D/3D CREATION/POSMs/BROOKSIDE/4.png"),
      category: "Brookside",
    },
  ],
};

// Static videos and reels from CDN
const staticVideosAndReels = {
  main: [
    {
      title: "NEW COUNT DOWN",
      src: getCdnUrl("videos&reels/Video and Reels/NEW COUNT DOWN.mp4"),
    },
    {
      title: "Pass The AUX",
      src: getCdnUrl("videos&reels/Video and Reels/Pass The AUX.mp4"),
    },
    {
      title: "WhatsApp Video",
      src: getCdnUrl(
        "videos&reels/Video and Reels/WhatsApp Video 2025-03-02 at 12.53.17.mp4",
      ),
    },
  ],
  caseStudies: [
    {
      title: "Chai Ni Ketepa",
      src: getCdnUrl(
        "videos&reels/Video and Reels/CASE STUDIES/CHAI NI KETEPA.mp4",
      ),
    },
    {
      title: "Indulge",
      src: getCdnUrl("videos&reels/Video and Reels/CASE STUDIES/INDULGE.mp4"),
    },
    {
      title: "SAC",
      src: getCdnUrl("videos&reels/Video and Reels/CASE STUDIES/SAC.mp4"),
    },
    {
      title: "Share A Coke",
      src: getCdnUrl(
        "videos&reels/Video and Reels/CASE STUDIES/SHARE A COKE.mp4",
      ),
    },
  ],
  infographics: [
    {
      title: "Beer Frame",
      src: getCdnUrl(
        "videos&reels/Video and Reels/INFOGRAPHICS/BEER frame_1.mp4",
      ),
    },
  ],
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    src: string;
    title: string;
    type: "image" | "video";
  } | null>(null);

  const openModal = (src: string, title: string, type: "image" | "video") => {
    setModalContent({ src, title, type });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await api.getProjects({
          category: category || undefined,
          limit: 50,
        });
        setProjects(res.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [category]);

  // Check if we should show sections
  const showAnimations = category === "" || category === "animations";
  const showDigitalPosts = category === "" || category === "digital-posts";
  const show3DCreations = category === "" || category === "3d-creation";
  const showVideosAndReels = category === "" || category === "video-and-reels";

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
              MY WORK
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              My{" "}
              <span className="bg-primary text-primary-foreground px-3 py-1 inline-block">
                Portfolio
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Explore my creative work across various design disciplines.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted hover:bg-secondary hover:text-white"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* 3D Creations Section */}
          {show3DCreations && (
            <div className="mb-12">
              {category === "" && (
                <h2 className="text-2xl font-bold mb-6">3D Creations</h2>
              )}

              {/* Activation Setups */}
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                Activation Setups
              </h3>
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
              >
                {static3DCreations.activationSetups.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(item.src, item.title, "image")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-xs">
                          {item.category}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Events */}
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                Events
              </h3>
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
              >
                {static3DCreations.events.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(item.src, item.title, "image")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-xs">
                          {item.category}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* POSMs */}
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                POSMs
              </h3>
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
              >
                {static3DCreations.posms.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(item.src, item.title, "image")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-xs">
                          {item.category}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Animations Section */}
          {showAnimations && (
            <div className="mb-12">
              {category === "" && (
                <h2 className="text-2xl font-bold mb-6">Animations</h2>
              )}
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {staticAnimations.map((animation, index) => (
                  <motion.div
                    key={animation.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() =>
                        openModal(animation.src, animation.title, "video")
                      }
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <video
                          src={animation.src}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">
                          {animation.title}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          Animation Project
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Digital Posts Section */}
          {showDigitalPosts && (
            <div className="mb-12">
              {category === "" && (
                <h2 className="text-2xl font-bold mb-6">Digital Posts</h2>
              )}
              {/* Images */}
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
              >
                {staticDigitalPosts.images.map((post, index) => (
                  <motion.div
                    key={post.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(post.src, post.title, "image")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <img
                          src={post.src}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">{post.title}</h3>
                        <p className="text-muted-foreground text-xs">
                          Digital Post
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
              {/* Videos */}
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {staticDigitalPosts.videos.map((video, index) => (
                  <motion.div
                    key={video.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(video.src, video.title, "video")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <video
                          src={video.src}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">
                          {video.title}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          Digital Post Video
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Videos and Reels Section */}
          {showVideosAndReels && (
            <div className="mb-12">
              {category === "" && (
                <h2 className="text-2xl font-bold mb-6">Videos & Reels</h2>
              )}

              {/* Main Videos */}
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
              >
                {staticVideosAndReels.main.map((video, index) => (
                  <motion.div
                    key={video.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(video.src, video.title, "video")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <video
                          src={video.src}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">
                          {video.title}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          Video Reel
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Case Studies */}
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                Case Studies
              </h3>
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
              >
                {staticVideosAndReels.caseStudies.map((video, index) => (
                  <motion.div
                    key={video.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(video.src, video.title, "video")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <video
                          src={video.src}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">
                          {video.title}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          Case Study
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Infographics */}
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                Infographics
              </h3>
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {staticVideosAndReels.infographics.map((video, index) => (
                  <motion.div
                    key={video.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(video.src, video.title, "video")}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        <video
                          src={video.src}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">
                          {video.title}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          Infographic
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Projects Grid */}
          {category !== "animations" &&
            category !== "digital-posts" &&
            category !== "3d-creation" &&
            category !== "video-and-reels" && (
              <>
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-muted rounded-xl aspect-[4/3] animate-pulse"
                      />
                    ))}
                  </div>
                ) : projects.length > 0 ? (
                  <motion.div
                    layout
                    className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    {projects.map((project, index) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : category !== "" ? (
                  <div className="text-center py-20 text-muted-foreground">
                    No projects found in this category.
                  </div>
                ) : null}
              </>
            )}
        </div>
      </section>

      {/* Media Modal */}
      {modalContent && (
        <MediaModal
          isOpen={modalOpen}
          onClose={closeModal}
          src={modalContent.src}
          title={modalContent.title}
          type={modalContent.type}
        />
      )}
    </>
  );
}
