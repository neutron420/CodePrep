import CallToAction from "@/components/templates/nova/sections/call-to-action-1";
import Content from "@/components/templates/nova/sections/content-1";
import FAQs from "@/components/templates/nova/sections/faqs-1";
import Features from "@/components/templates/nova/sections/features-1";
import Footer from "@/components/templates/nova/sections/footer-1";
import HeroSection from "@/components/templates/nova/sections/hero-section-1";
import Pricing from "@/components/templates/nova/sections/pricing-1";
import Topics from "@/components/templates/nova/sections/topics-1";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CodeCraft — Company-wise Coding Interview Prep",
  description:
    "Practice LeetCode problems by company, filter by topic, and track your solved progress.",
};

export default function Landing() {
  return (
    <>
      <HeroSection />
      <Features />
      <Topics />
      <Content />
      <Pricing />
      <FAQs />
      <CallToAction />
      <Footer />
    </>
  );
}
