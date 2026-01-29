import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-primary">
              Portfolio
            </Link>
            <p className="mt-4 text-white/70 max-w-md">
              Creating beautiful and functional designs that help brands stand
              out and connect with their audience.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1 md:col-span-2">
              <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
              <ul className="flex flex-wrap gap-6">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © {currentYear} Felix. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link
              href="/admin"
              className="text-sm text-white/60 hover:text-primary transition-colors"
            ></Link>
            <a
              href="mailto:solohfelix@gmail.com"
              className="flex items-center text-sm text-white/60 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4 mr-1" />
              solohfelix@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
