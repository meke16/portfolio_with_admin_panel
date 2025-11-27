import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import type { AdminInfo } from "@shared/schema";

interface AboutSectionProps {
  adminInfo?: AdminInfo | null;
  isLoading?: boolean;
}

export function AboutSection({ adminInfo, isLoading }: AboutSectionProps) {
  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("github")) return <SiGithub className="w-5 h-5" />;
    if (platformLower.includes("linkedin")) return <SiLinkedin className="w-5 h-5" />;
    if (platformLower.includes("twitter") || platformLower.includes("x")) return <SiX className="w-5 h-5" />;
    return null;
  };

  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-muted/30"
      data-testid="section-about"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16" data-testid="text-about-heading">
          About Me
        </h2>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-full" />
              <div className="h-6 bg-muted rounded w-2/3" />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transform rotate-6" />
                <Avatar className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl border-4 border-background shadow-xl">
                  <AvatarImage
                    src={adminInfo?.profileImage || ""}
                    alt={adminInfo?.name || "Profile"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-6xl font-display rounded-2xl">
                    {adminInfo?.name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="space-y-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground" data-testid="text-about-bio">
                  {adminInfo?.bio ||
                    "I'm a passionate developer who loves creating beautiful, functional web applications. With a focus on user experience and clean code, I bring ideas to life through technology."}
                </p>
              </div>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Contact Details</h3>
                
                {adminInfo?.email && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-primary" />
                    <a
                      href={`mailto:${adminInfo.email}`}
                      className="hover:text-primary transition-colors"
                      data-testid="link-email"
                    >
                      {adminInfo.email}
                    </a>
                  </div>
                )}

                {adminInfo?.phones && adminInfo.phones.length > 0 && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-5 h-5 text-primary" />
                    <span data-testid="text-phone">{adminInfo.phones[0]}</span>
                  </div>
                )}

                {adminInfo?.locations && adminInfo.locations.length > 0 && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span data-testid="text-location">{adminInfo.locations[0]}</span>
                  </div>
                )}
              </Card>

              {adminInfo?.socials && adminInfo.socials.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Connect with me:</span>
                  <div className="flex items-center gap-2">
                    {adminInfo.socials.map((social, index) => {
                      const icon = getSocialIcon(social.platform);
                      if (!icon) return null;
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                          data-testid={`link-about-social-${index}`}
                        >
                          {icon}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
