"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Service } from "@/lib/api";
import { Button } from "./button";

interface ServiceCardProps {
  service: Service;
  index?: number;
}

const iconMap: Record<string, string> = {
  palette: "🎨",
  star: "⭐",
  layout: "📱",
  printer: "🖨️",
  share: "📲",
};

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const formatPrice = () => {
    if (!service.pricing || service.pricing.pricingType === "contact") {
      return "Contact for pricing";
    }
    const price = service.pricing.startingPrice;
    const currency = service.pricing.currency || "USD";
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    });

    switch (service.pricing.pricingType) {
      case "hourly":
        return `From ${formatter.format(price!)}/hr`;
      case "fixed":
        return `${formatter.format(price!)}`;
      case "project-based":
        return `Starting at ${formatter.format(price!)}`;
      default:
        return "Contact for pricing";
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors h-full flex flex-col"
    >
      {/* Icon */}
      <div className="text-4xl mb-4">{iconMap[service.icon || ""] || "✨"}</div>

      {/* Title & Description */}
      <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
      <p className="text-muted-foreground text-sm mb-4 flex-grow">
        {service.description}
      </p>

      {/* Features */}
      {service.features.length > 0 && (
        <ul className="space-y-2 mb-6">
          {service.features.slice(0, 5).map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Price & CTA */}
      <div className="mt-auto">
        <p className="text-lg font-semibold text-primary mb-4">
          {formatPrice()}
        </p>
        <Button href="/contact" variant="outline" className="w-full">
          Get Started
        </Button>
      </div>
    </motion.article>
  );
}
