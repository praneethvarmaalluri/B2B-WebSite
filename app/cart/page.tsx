"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/lib/cart-types";

type CategoryObject = {
  name?: string;
};

function getCategoryLabel(item: CartItem): string {
  if (typeof item.category === "string") {
    return item.category;
  }

  if (item.category && typeof item.category === "object") {
    const categoryObj = item.category as CategoryObject;

    if (typeof categoryObj.name === "string" && categoryObj.name.trim()) {
      return categoryObj.name;
    }
  }

  return "Uncategorized";
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();

  const subtotal = items.reduce((sum: number, item: CartItem) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Cart</p>
              <h1 className="mt-2 text-3xl font-bold">Your Shopping Bag</h1>
            </div>

            {items.length > 0 ? (
              <button
                onClick={clearCart}
                className="text-sm text-zinc-400 transition hover:text-red-400"
              >
                Clear cart
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-card px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03]">
                <ShoppingBag className="h-7 w-7 text-zinc-400" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold">Your cart is empty</h2>

              <p className="mt-2 text-zinc-400">
                Go add something. Stores usually work better when customers behave like customers.
              </p>

              <div className="mt-6">
                <Link href="/shop">
                  <AnimatedButton>Continue Shopping</AnimatedButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
              <div className="space-y-4">
                {items.map((item: CartItem) => {
                  const categoryLabel = getCategoryLabel(item);

                  return (
                    <div
                      key={`${item.productId}-${item.size || "nosize"}-${item.color || "nocolor"}`}
                      className="rounded-3xl border border-white/10 bg-card p-4"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                          <Image
                            src={item.image || "/products/item1.jpeg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="line-clamp-2 text-base font-semibold">
                                {item.name}
                              </h3>

                              <p className="mt-1 text-sm text-zinc-400">{categoryLabel}</p>

                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
                                {item.size ? (
                                  <span className="rounded-full border border-white/10 px-2 py-1">
                                    Size: {item.size}
                                  </span>
                                ) : null}

                                {item.color ? (
                                  <span className="rounded-full border border-white/10 px-2 py-1">
                                    Color: {item.color}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                removeFromCart(item.productId, item.size, item.color)
                              }
                              className="rounded-full border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    Math.max(1, item.quantity - 1),
                                    item.size,
                                    item.color
                                  )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition hover:border-white/20"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>

                              <div className="flex h-10 min-w-12 items-center justify-center rounded-2xl border border-white/10 px-4">
                                {item.quantity}
                              </div>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                    item.size,
                                    item.color
                                  )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition hover:border-white/20"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-zinc-400">
                                {formatCurrency(item.price)} each
                              </p>

                              <p className="text-lg font-bold">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="h-fit rounded-3xl border border-white/10 bg-card p-5 lg:sticky lg:top-24">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Items</span>
                    <span>{items.length}</span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span>Calculated on WhatsApp</span>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="mt-5 block">
                  <AnimatedButton className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </AnimatedButton>
                </Link>

                <Link href="/shop" className="mt-3 block">
                  <AnimatedButton variant="outline" className="w-full">
                    Continue Shopping
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
      <MobileBottomNav />
    </>
  );
}