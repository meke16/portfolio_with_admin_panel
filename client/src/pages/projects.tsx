import { useQuery } from "@tanstack/react-query";
import { PublicNav } from "@/components/public-nav";
import { ProjectsSection } from "@/components/projects-section";
import { Footer } from "@/components/footer";
import type { AdminInfo, Project } from "@shared/schema";

export default function Projects() {
  const { data: adminInfo } = useQuery<AdminInfo>({
    queryKey: ["/api/info"],
  });

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="min-h-screen" data-testid="page-projects">
      <PublicNav />
      <div className="pt-20">
        <ProjectsSection projects={projects} isLoading={isLoading} showFilter={true} />
      </div>
      <Footer adminInfo={adminInfo} />
    </div>
  );
}
