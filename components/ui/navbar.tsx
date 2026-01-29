"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { getCdnUrl } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/skills", label: "Skills" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <nav className="max-w-6xl mx-auto">
        <div className="bg-secondary/95 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.span
                className="text-xl font-bold text-white hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Portfolio
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA & Theme Toggle */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              <a
                href={getCdnUrl("cv.pdf")}
                download
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-2"
            >
              <div className="bg-secondary/95 backdrop-blur-md rounded-2xl px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary/20 text-primary"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={getCdnUrl("cv.pdf")}
                  download
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold text-center mt-4"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
