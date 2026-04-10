"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MessageCircle, PhoneCall, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/types";
import { STORE_INFO } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { SelectPill } from "@/components/ui/select-pill";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";

export function ProductDetailsContent({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const safeImages = useMemo(() => {
    return Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/products/item1.jpeg"];
  }, [product.images]);

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "Uncategorized";

  const effectivePrice = product.discountPrice ?? product.price;
  const total = effectivePrice * quantity;

  function handleAddToCart() {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: safeImages[selectedImage] || safeImages[0],
      price: effectivePrice,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      category: product.category
    });

    toast.success("Added to cart");
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/cart");
  }

  const whatsappMessage = `Hi Brand 2 Brands Fashion Store,
I want to order:
Product: ${product.name}
Category: ${categoryName}
${selectedSize ? `Size: ${selectedSize}` : ""}
${selectedColor ? `Color: ${selectedColor}` : ""}
Quantity: ${quantity}
Total: ${formatCurrency(total)}
Please confirm availability.`;

  const whatsappUrl = `https://wa.me/${String(STORE_INFO.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-card">
            <Image
              src={safeImages[selectedImage] || safeImages[0]}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {safeImages.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {safeImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-[4/5] overflow-hidden rounded-2xl border ${
                    selectedImage === index
                      ? "border-accent"
                      : "border-white/10"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {product.newArrival ? <Badge variant="accent">New Arrival</Badge> : null}
            {product.bestSeller ? <Badge>Best Seller</Badge> : null}
            {product.featured ? <Badge>Featured</Badge> : null}
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-400">
            {categoryName}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-sm leading-7 text-zinc-300">
            {product.description}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-bold text-white">
              {formatCurrency(effectivePrice)}
            </span>
            {product.discountPrice ? (
              <span className="text-lg text-zinc-500 line-through">
                {formatCurrency(product.price)}
              </span>
            ) : null}
          </div>

          {product.sizes?.length ? (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-white">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <SelectPill
                    key={size}
                    label={size}
                    active={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {product.colors?.length ? (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-white">Select Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <SelectPill
                    key={color}
                    label={color}
                    active={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-white">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white"
              >
                -
              </button>
              <div className="flex h-11 min-w-14 items-center justify-center rounded-2xl border border-white/10 bg-card px-4 text-white">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <AnimatedButton onClick={handleAddToCart}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </AnimatedButton>

            <AnimatedButton variant="secondary" onClick={handleBuyNow}>
              Buy Now
            </AnimatedButton>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <AnimatedButton variant="outline" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Order
              </AnimatedButton>
            </a>

            <a href={`tel:${STORE_INFO.phone}`}>
              <AnimatedButton variant="outline" className="w-full">
                <PhoneCall className="mr-2 h-4 w-4" />
                Call Store
              </AnimatedButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}