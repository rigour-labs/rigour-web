import { Navbar } from "@/components/Navbar";
import { BentoHero } from "@/components/BentoHero";
import { Features } from "@/components/Features";
import { AuditShowcase } from "@/components/AuditShowcase";
import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-grid">
      <Navbar />
      <BentoHero />
      <Features />
      <AuditShowcase />
      <Community />
      <Footer />
    </main>
  );
}
