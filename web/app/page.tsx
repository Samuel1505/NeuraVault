import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import TrustStrip from "./components/landing/TrustStrip";
import Features from "./components/landing/Features";
import HowItWorks from "./components/landing/HowItWorks";
import DataTypes from "./components/landing/DataTypes";
import Architecture from "./components/landing/Architecture";
import UseCases from "./components/landing/UseCases";
import Testimonials from "./components/landing/Testimonials";
import CTASection from "./components/landing/CTASection";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <DataTypes />
        <Architecture />
        <UseCases />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
