import { useQuery } from "@tanstack/react-query";
import { PublicNav } from "@/components/public-nav";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import type { AdminInfo } from "@shared/schema";

export default function Contact() {
  const { data: adminInfo } = useQuery<AdminInfo>({
    queryKey: ["/api/info"],
  });

  return (
    <div className="min-h-screen" data-testid="page-contact">
      <PublicNav />
      <div className="pt-20">
        <ContactForm adminInfo={adminInfo} />
      </div>
      <Footer adminInfo={adminInfo} />
    </div>
  );
}
