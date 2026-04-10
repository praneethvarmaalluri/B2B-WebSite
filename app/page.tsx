// app/page.tsx

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { HeroSection } from "@/components/sections/hero-section";
import { PromoBanner } from "@/components/sections/promo-banner";
import { CategoriesSection } from "@/components/sections/categories-section";
import { FeaturedSection } from "@/components/sections/featured-section";


export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <HeroSection />
        <PromoBanner />
        <CategoriesSection />
        <FeaturedSection />
      </main>
      <Footer />
      <WhatsAppFloating />
      <MobileBottomNav />
    </>
  );
}