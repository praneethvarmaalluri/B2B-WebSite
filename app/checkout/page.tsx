"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "cod" | "online";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  useEffect(() => {
    if (!items.length) return;
    // Optional tiny UX thing: scroll to top on checkout load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [items.length]);

  async function handlePlaceOrder() {
    if (!items.length) {
      router.push("/cart");
      return;
    }

    // Required field validation
    if (
      !customerName.trim() ||
      !phone.trim() ||
      !addressLine.trim() ||
      !city.trim() ||
      !stateName.trim() ||
      !pincode.trim()
    ) {
      toast.error("Please fill all required customer details.");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Pincode must be exactly 6 digits.");
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (paymentMethod === "online" && !razorpayReady) {
      toast.error("Payment gateway is still loading. Try again in a second.");
      return;
    }

    setLoading(true);

    try {
      let paymentGatewayOrderId: string | null = null;
      let paymentGatewayPaymentId: string | null = null;

      // 1) Handle Razorpay if online payment selected
      if (paymentMethod === "online") {
        const rpRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: total
          })
        });

        const rpData = await rpRes.json();

        if (!rpRes.ok) {
          toast.error(rpData.error || "Failed to initialize payment.");
          setLoading(false);
          return;
        }

        paymentGatewayOrderId = rpData.id;

        const paymentResult = await new Promise<{
          success: boolean;
          paymentId?: string;
        }>((resolve) => {
          if (!window.Razorpay) {
            resolve({ success: false });
            return;
          }

          const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: rpData.amount,
            currency: rpData.currency || "INR",
            name: "B2B Fashion Store",
            description: "Order Payment",
            order_id: rpData.id,
            prefill: {
              name: customerName.trim(),
              email: email.trim(),
              contact: phone.trim()
            },
            notes: {
              customer_name: customerName.trim(),
              customer_phone: phone.trim()
            },
            handler: function (response: any) {
              resolve({
                success: true,
                paymentId: response?.razorpay_payment_id || ""
              });
            },
            modal: {
              ondismiss: function () {
                resolve({ success: false });
              }
            },
            theme: {
              color: "#ef4444"
            }
          });

          rzp.open();
        });

        if (!paymentResult.success) {
          toast.error("Payment was cancelled.");
          setLoading(false);
          return;
        }

        paymentGatewayPaymentId = paymentResult.paymentId || null;
      }

      // 2) Save order in DB after COD / successful online payment
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: phone.trim(),
          customer_email: email.trim() || null,
          address_line: addressLine.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
          payment_method: paymentMethod,
          customer_note: [
            landmark.trim() ? `Landmark: ${landmark.trim()}` : "",
            notes.trim() ? `Note: ${notes.trim()}` : "",
            paymentGatewayOrderId ? `Gateway Order ID: ${paymentGatewayOrderId}` : "",
            paymentGatewayPaymentId ? `Gateway Payment ID: ${paymentGatewayPaymentId}` : ""
          ]
            .filter(Boolean)
            .join(" | "),
          items
        })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to place order.");
        setLoading(false);
        return;
      }

      clearCart();
      toast.success("Order placed successfully");

      router.push(
        `/order-success?orderNumber=${encodeURIComponent(
          result.orderNumber
        )}&paymentMethod=${encodeURIComponent(paymentMethod)}`
      );
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Correct Razorpay loading. Not that cursed /public import nonsense. */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayReady(true)}
        onError={() => {
          setRazorpayReady(false);
          console.error("Failed to load Razorpay checkout script");
        }}
      />

      <Header />

      <main className="min-h-screen bg-background text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-bold">Complete Your Order</h1>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-card px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="mt-2 text-zinc-400">
                You can’t checkout confidence and air.
              </p>
              <div className="mt-6">
                <AnimatedButton onClick={() => router.push("/shop")}>
                  Go to Shop
                </AnimatedButton>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
              {/* Left column */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-card p-5">
                  <h2 className="text-xl font-semibold">Customer Details</h2>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Input
                      placeholder="Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />

                    <Input
                      placeholder="Phone Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="numeric"
                    />

                    <Input
                      placeholder="Email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="sm:col-span-2"
                    />

                    <Textarea
                      placeholder="Delivery Address *"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="sm:col-span-2"
                    />

                    <Input
                      placeholder="City *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />

                    <Input
                      placeholder="State *"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />

                    <Input
                      placeholder="Pincode *"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      inputMode="numeric"
                    />

                    <Input
                      placeholder="Landmark (optional)"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />

                    <Textarea
                      placeholder="Order note / special instructions (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="sm:col-span-2"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-card p-5">
                  <h2 className="text-xl font-semibold">Payment Method</h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        paymentMethod === "cod"
                          ? "border-accent bg-accent/10"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="mt-1 text-sm text-zinc-400">
                        Customer pays on delivery
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        paymentMethod === "online"
                          ? "border-accent bg-accent/10"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <div className="font-medium">Online Payment</div>
                      <div className="mt-1 text-sm text-zinc-400">
                        Secure checkout with Razorpay
                      </div>
                      {!razorpayReady && paymentMethod === "online" ? (
                        <div className="mt-2 text-xs text-yellow-400">
                          Loading payment gateway...
                        </div>
                      ) : null}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="h-fit rounded-3xl border border-white/10 bg-card p-5 lg:sticky lg:top-24">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size || "nosize"}-${item.color || "nocolor"}`}
                      className="flex gap-3"
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={item.image || "/products/item1.jpeg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                        <p className="mt-1 text-xs text-zinc-400">
                          Qty: {item.quantity}
                          {item.size ? ` • ${item.size}` : ""}
                          {item.color ? ` • ${item.color}` : ""}
                        </p>
                      </div>

                      <div className="text-sm font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <AnimatedButton
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading
                      ? paymentMethod === "online"
                        ? "Processing Payment..."
                        : "Placing Order..."
                      : paymentMethod === "online"
                      ? "Pay & Place Order"
                      : "Place Order"}
                  </AnimatedButton>
                </div>

                <p className="mt-3 text-xs text-zinc-500">
                  Order is saved first, then you can confirm it on WhatsApp from the
                  success page.
                </p>
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