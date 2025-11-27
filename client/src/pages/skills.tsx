import { useQuery } from "@tanstack/react-query";
import { PublicNav } from "@/components/public-nav";
import { SkillsSection } from "@/components/skills-section";
import { Footer } from "@/components/footer";
import type { AdminInfo, Skill } from "@shared/schema";

export default function Skills() {
  const { data: adminInfo } = useQuery<AdminInfo>({
    queryKey: ["/api/info"],
  });

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  return (
    <div className="min-h-screen" data-testid="page-skills">
      <PublicNav />
      <div className="pt-20">
        <SkillsSection skills={skills} isLoading={isLoading} />
      </div>
      <Footer adminInfo={adminInfo} />
    </div>
  );
}
