import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";

export default function FaqPage() {
  const faqs = [
    {
      q: "How can I place an order?",
      a: "You can order through the cart/checkout flow or directly via WhatsApp."
    },
    {
      q: "Do you have Cash on Delivery?",
      a: "Yes, Cash on Delivery is available. Final confirmation depends on location."
    },
    {
      q: "How often do new products arrive?",
      a: "New stock arrives frequently throughout the year, so keep checking for fresh drops."
    },
    {
      q: "Can I ask about sizes and availability before ordering?",
      a: "Yes. Use the WhatsApp button to confirm size, color, and stock before final purchase."
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>

          <div className="mt-6 space-y-4">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-3xl border border-white/10 bg-card p-5"
              >
                <h2 className="text-lg font-semibold text-white">{item.q}</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloating />
      <MobileBottomNav />
    </>
  );
}