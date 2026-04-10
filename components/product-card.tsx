"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

function getEffectivePrice(price: number, discountPrice?: number | null) {
  return discountPrice ?? price;
}

export function ProductCard({ product }: { product: Product }) {
  const effectivePrice = getEffectivePrice(product.price, product.discountPrice);

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "Uncategorized";

  const imageSrc =
    Array.isArray(product.images) && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : "/products/item1.jpeg";

  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0.92, y: 20 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true, amount: 0.2 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-card">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />

            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              {product.newArrival ? <Badge variant="accent">New</Badge> : null}
              {product.bestSeller ? <Badge>Best Seller</Badge> : null}
              {product.featured ? <Badge>Featured</Badge> : null}
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                {categoryName}
              </p>
              <h3 className="mt-1 line-clamp-2 text-base font-semibold text-white">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">
                {formatCurrency(effectivePrice)}
              </span>

              {product.discountPrice ? (
                <span className="text-sm text-zinc-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {product.stockCount > 0
                  ? `${product.stockCount} left`
                  : "Out of stock"}
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}