import { useQuery } from "@tanstack/react-query";
import { PublicNav } from "@/components/public-nav";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { GallerySection } from "@/components/gallery-section";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import type { AdminInfo, Project, Skill } from "@shared/schema";

export default function Home() {
  const { data: adminInfo, isLoading: adminInfoLoading } = useQuery<AdminInfo>({
    queryKey: ["/api/info"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  return (
    <div className="min-h-screen" data-testid="page-home">
      <PublicNav adminInfo={adminInfo} isLoading={adminInfoLoading} />
      <HeroSection adminInfo={adminInfo} isLoading={adminInfoLoading} />
      <AboutSection adminInfo={adminInfo} isLoading={adminInfoLoading} />
      <SkillsSection skills={skills} isLoading={skillsLoading} />
      <ProjectsSection projects={projects} isLoading={projectsLoading} showFilter={false} />
      <GallerySection adminInfo={adminInfo} isLoading={adminInfoLoading} />
      <ContactForm adminInfo={adminInfo} />
      <Footer adminInfo={adminInfo} />
    </div>
  );
}
