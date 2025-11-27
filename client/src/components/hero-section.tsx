import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import type { AdminInfo } from "@shared/schema";

interface HeroSectionProps {
  adminInfo?: AdminInfo | null;
  isLoading?: boolean;
}

export function HeroSection({ adminInfo, isLoading }: HeroSectionProps) {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("github")) return <SiGithub className="w-5 h-5" />;
    if (platformLower.includes("linkedin")) return <SiLinkedin className="w-5 h-5" />;
    if (platformLower.includes("twitter") || platformLower.includes("x")) return <SiX className="w-5 h-5" />;
    return <Mail className="w-5 h-5" />;
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10"
        style={{
          backgroundImage: adminInfo?.heroImage
            ? `url(${adminInfo.heroImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {adminInfo?.heroImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center">
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-20 md:h-32 bg-muted rounded-lg w-3/4 mx-auto" />
            <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-12 bg-muted rounded w-1/3 mx-auto" />
          </div>
        ) : (
          <>
            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
              data-testid="text-hero-name"
            >
              {adminInfo?.name || "Creative Developer"}
            </h1>
            
            <p
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium mb-8"
              data-testid="text-hero-title"
            >
              {adminInfo?.title || "Building Beautiful Digital Experiences"}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/projects">
                <Button size="lg" className="px-8" data-testid="button-view-work">
                  View My Work
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-8" data-testid="button-get-in-touch">
                  Get In Touch
                </Button>
              </Link>
            </div>

            {adminInfo?.socials && adminInfo.socials.length > 0 && (
              <div className="flex items-center justify-center gap-4" data-testid="social-links">
                {adminInfo.socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                    data-testid={`link-social-${index}`}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 animate-bounce"
        aria-label="Scroll to about section"
        data-testid="button-scroll-down"
      >
        <ChevronDown className="w-8 h-8 text-muted-foreground" />
      </button>
    </section>
  );
}
