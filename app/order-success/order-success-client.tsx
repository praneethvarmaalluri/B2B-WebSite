"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrderSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get("orderNumber") || "B2B-ORDER";
  const whatsappUrl = searchParams.get("whatsappUrl") || "";
  const customerName = searchParams.get("name") || "";

  const handleConfirmOnWhatsApp = () => {
    if (whatsappUrl) {
      window.open(decodeURIComponent(whatsappUrl), "_blank", "noopener,noreferrer");
      return;
    }

    const fallbackMessage = encodeURIComponent(
      `Hi Brand 2 Brands, I want to confirm my order ${orderNumber}${customerName ? ` for ${customerName}` : ""}.`
    );

    window.open(`https://wa.me/919030729233?text=${fallbackMessage}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <div className="w-full max-w-3xl rounded-[36px] border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-white/[0.01] p-5 shadow-2xl sm:p-8">
          <div className="rounded-[28px] border border-white/10 bg-black/60 p-6 sm:p-8">
            <div className="mb-6 flex justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/20">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-white sm:text-5xl">
                Order Placed Successfully
              </h1>

              <p className="mt-3 text-sm text-zinc-400 sm:text-lg">
                Your order is saved in our system. Miraculously, technology worked.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-center sm:p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Order Number</p>
              <p className="mt-3 break-words text-2xl font-bold text-red-500 sm:text-4xl">
                {orderNumber}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleConfirmOnWhatsApp}
                className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500"
              >
                Confirm on WhatsApp
              </button>

              <button
                type="button"
                onClick={() => router.push("/shop")}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-zinc-100"
              >
                Continue Shopping
              </button>
            </div>

            <Link
              href="/shop"
              className="mt-5 block text-center text-sm text-zinc-400 transition hover:text-white"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}