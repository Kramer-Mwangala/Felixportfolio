'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink, User } from 'lucide-react';
import { Button } from '@/components/ui';
import { api, Project } from '@/lib/api';
import { getCategoryLabel, formatDate } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.getProject(params.slug as string);
        setProject(res.project);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted w-32 mb-8 rounded" />
            <div className="aspect-video bg-muted rounded-xl mb-8" />
            <div className="h-10 bg-muted w-3/4 mb-4 rounded" />
            <div className="h-4 bg-muted w-full mb-2 rounded" />
            <div className="h-4 bg-muted w-2/3 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Button href="/portfolio">Back to Portfolio</Button>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-8"
        >
          {project.images[selectedImage] ? (
            <Image
              src={project.images[selectedImage].url}
              alt={project.images[selectedImage].alt || project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🎨
            </div>
          )}
        </motion.div>

        {/* Image Thumbnails */}
        {project.images.length > 1 && (
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {project.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${project.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Project Info */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {getCategoryLabel(project.category)}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">{project.title}</h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Tools */}
            {project.tools.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Tools Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Client */}
            {project.client?.name && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Client</h3>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>{project.client.name}</span>
                </div>
                {project.client.website && (
                  <a
                    href={project.client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>
            )}

            {/* Date */}
            {project.completedAt && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Completed</h3>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>{formatDate(project.completedAt)}</span>
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Button href="/contact" className="w-full">
              Start a Similar Project
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
