import { Navbar } from "@/components/Navbar";
import { BentoHero } from "@/components/BentoHero";
import { AuditShowcase } from "@/components/AuditShowcase";
import { RegulatedIndustries } from "@/components/RegulatedIndustries";
import { Features } from "@/components/Features";
import { Leaderboard } from "@/components/Leaderboard";
import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-grid">
      <Navbar />
      <BentoHero />
      <AuditShowcase />
      <RegulatedIndustries />
      <Features />
      <Leaderboard />
      <Community />
      <Footer />
    </main>
  );
}
