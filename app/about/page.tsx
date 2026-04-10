import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">About Brand 2 Brands</h1>

          <div className="mt-6 rounded-3xl border border-white/10 bg-card p-6 text-sm leading-8 text-zinc-300">
            <p>
              Brand 2 Brands Fashion Store is built for people who want bold,
              confident, premium fashion with a strong streetwear-inspired vibe.
            </p>
            <p className="mt-4">
              From everyday shirts and pants to sweatshirts, shoes, caps,
              watches, and handbags, the store focuses on style that feels
              current, wearable, and expressive.
            </p>
            <p className="mt-4">
              Our goal is simple: bring fresh stock regularly, help customers
              order easily through cart or WhatsApp, and make fashion shopping
              feel smooth on mobile and in-store.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloating />
      <MobileBottomNav />
    </>
  );
}