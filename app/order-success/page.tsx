"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { AnimatedButton } from "@/components/ui/animated-button";
import { STORE_INFO } from "@/lib/constants";


export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("orderNumber") || "B2B-ORDER";
  const paymentMethod = searchParams.get("paymentMethod") || "cod";

  const whatsappUrl = useMemo(() => {
    const phone = String(STORE_INFO.whatsapp || "").replace(/\D/g, "");
    const msg = `Hi Brand 2 Brands,
I placed an order on the website.

Order Number: ${orderNumber}
Payment Method: ${paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}

Please confirm my order.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }, [orderNumber, paymentMethod]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full rounded-[2rem] border border-white/10 bg-card p-5 sm:p-8">
            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6 sm:p-10 text-center">
                


              <h1 className="text-3xl font-bold sm:text-5xl">Order Placed Successfully</h1>
              <p className="mt-3 text-zinc-400 text-sm sm:text-lg">
                Your order is saved in our system. We will update you soon!.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Order Number</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-accent">{orderNumber}</p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <AnimatedButton className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Confirm on WhatsApp
                  </AnimatedButton>
                </a>

                <AnimatedButton
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push("/shop")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </AnimatedButton>
              </div>

              <div className="mt-5">
                <Link href="/shop" className="text-sm text-zinc-400 hover:text-white">
                  Back to Shop
                </Link>
              </div>
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