"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { api, Service } from "@/lib/api";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.getServices();
        setServices(res.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
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
              WHAT I OFFER
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              My{" "}
              <span className="bg-primary text-primary-foreground px-3 py-1 inline-block">
                Services
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Professional design services tailored to elevate your brand and
              business.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 border border-border hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-primary mb-2 block">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {service.shortDescription || service.description}
                  </p>

                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    href="/contact"
                    variant="ghost"
                    size="sm"
                    className="text-primary p-0 group-hover:gap-3"
                  >
                    Get Started{" "}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className="w-full md:w-64 h-48 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/30 to-primary/10 flex items-center justify-center text-6xl">
                  {service.icon || "✨"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
