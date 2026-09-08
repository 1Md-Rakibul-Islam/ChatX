import { Navbar } from "@/components/partials/Navbar";
import HeroSection from "@/components/sections/landing/HeroSection";
import FeaturesSection from "@/components/sections/landing/FeaturesSection";
import Footer from "@/components/partials/Footer";
import CTASection from "@/components/sections/landing/CTASection";
import ShowcaseSection from "@/components/sections/landing/ShowcaseSection";
import HowItWorks from "@/components/sections/landing/HowItWorks";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;
