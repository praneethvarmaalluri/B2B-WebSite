import { Suspense } from "react";
import OrderSuccessClient from "./order-success-client";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">
            <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl">Loading order details...</h1>
              <p className="mt-3 text-sm text-zinc-400 sm:text-base">
                One moment. The internet is pretending to work.
              </p>
            </div>
          </div>
        </main>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}