import { useQuery } from "@tanstack/react-query";
import { PublicNav } from "@/components/public-nav";
import { GallerySection } from "@/components/gallery-section";
import { Footer } from "@/components/footer";
import type { AdminInfo } from "@shared/schema";

export default function Gallery() {
  const { data: adminInfo, isLoading } = useQuery<AdminInfo>({
    queryKey: ["/api/info"],
  });

  return (
    <div className="min-h-screen" data-testid="page-gallery">
      <PublicNav />
      <div className="pt-20">
        <GallerySection adminInfo={adminInfo} isLoading={isLoading} />
      </div>
      <Footer adminInfo={adminInfo} />
    </div>
  );
}
