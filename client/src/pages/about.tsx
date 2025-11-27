import { useQuery } from "@tanstack/react-query";
import { PublicNav } from "@/components/public-nav";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";
import type { AdminInfo } from "@shared/schema";

export default function About() {
  const { data: adminInfo, isLoading } = useQuery<AdminInfo>({
    queryKey: ["/api/info"],
  });

  return (
    <div className="min-h-screen" data-testid="page-about">
      <PublicNav />
      <div className="pt-20">
        <AboutSection adminInfo={adminInfo} isLoading={isLoading} />
      </div>
      <Footer adminInfo={adminInfo} />
    </div>
  );
}
