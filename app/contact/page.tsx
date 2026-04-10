import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { STORE_INFO } from "@/lib/constants";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-card p-6">
              <h2 className="text-xl font-semibold text-white">Store Details</h2>

              <div className="mt-5 space-y-4 text-sm text-zinc-300">
                <p>
                  <span className="font-semibold text-white">Address:</span>{" "}
                  {STORE_INFO.address}
                </p>
                <p>
                  <span className="font-semibold text-white">Phone:</span>{" "}
                  {STORE_INFO.phone}
                </p>
                <p>
                  <span className="font-semibold text-white">Email:</span>{" "}
                  {STORE_INFO.email}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${STORE_INFO.phone}`}>
                  <AnimatedButton>Call Store</AnimatedButton>
                </a>

                <a
                  href={STORE_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AnimatedButton variant="outline">Instagram</AnimatedButton>
                </a>

                <a
                  href={STORE_INFO.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AnimatedButton variant="secondary">Open Map</AnimatedButton>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-card p-3">
              <iframe
                src="https://www.google.com/maps?q=Siva%20Reddy%20Bar%2C%20Pedda%20Waltair%20Junction%2C%20Visakhapatnam&output=embed"
                width="100%"
                height="420"
                loading="lazy"
                className="rounded-3xl border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloating />
      <MobileBottomNav />
    </>
  );
}