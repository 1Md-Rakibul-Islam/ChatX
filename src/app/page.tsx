import { Navbar } from "@/components/partials/Navbar";
import HeroSection from "@/components/sections/landing/HeroSection";
import FeaturesSection from "@/components/sections/landing/FeaturesSection";
import Footer from "@/components/partials/Footer";
import CTASection from "@/components/sections/landing/CTASection";
import ShowcaseSection from "@/components/sections/landing/ShowcaseSection";
import HowItWorks from "@/components/sections/landing/HowItWorks";

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

export default App;
