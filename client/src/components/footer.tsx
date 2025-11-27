import { Link } from "wouter";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { Mail } from "lucide-react";
import type { AdminInfo } from "@shared/schema";

interface FooterProps {
  adminInfo?: AdminInfo | null;
}

export function Footer({ adminInfo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("github")) return <SiGithub className="w-5 h-5" />;
    if (platformLower.includes("linkedin")) return <SiLinkedin className="w-5 h-5" />;
    if (platformLower.includes("twitter") || platformLower.includes("x")) return <SiX className="w-5 h-5" />;
    return <Mail className="w-5 h-5" />;
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/skills", label: "Skills" },
    { href: "/projects", label: "Projects" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-muted/50 border-t" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/">
              <span className="font-display text-2xl font-bold" data-testid="footer-logo">
                Portfolio
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm">
              {adminInfo?.bio?.slice(0, 120) || "Building beautiful digital experiences with modern web technologies."}
              {adminInfo?.bio && adminInfo.bio.length > 120 ? "..." : ""}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span
                      className="text-muted-foreground hover:text-primary transition-colors"
                      data-testid={`footer-link-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="space-y-4">
              {adminInfo?.email && (
                <a
                  href={`mailto:${adminInfo.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-email"
                >
                  <Mail className="w-4 h-4" />
                  {adminInfo.email}
                </a>
              )}
              
              {adminInfo?.socials && adminInfo.socials.length > 0 && (
                <div className="flex items-center gap-3">
                  {adminInfo.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      data-testid={`footer-social-${index}`}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground" data-testid="footer-copyright">
            {currentYear} {adminInfo?.name || "Portfolio"}. All rights reserved.
          </p>
          <Link href="/admin">
            <span className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors mt-2 inline-block">
              Admin
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
