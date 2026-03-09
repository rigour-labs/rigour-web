import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { DemoExperience } from "@/components/demo/DemoExperience";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Live Demo",
  description:
    "Rigour live supervision demo: run scan on a public GitHub repo, watch IN/OUT/PERSIST governance, and see agent correction to PASS.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-grid">
      <Navbar />
      <DemoExperience />
      <Footer />
    </main>
  );
}
