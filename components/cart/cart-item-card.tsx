"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { CartItem } from "@/lib/cart-types";
import { formatCurrency } from "@/lib/utils";

export function CartItemCard({
  item,
  onDecrease,
  onIncrease,
  onRemove
}: {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0.92, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 rounded-3xl border border-white/10 bg-card p-4"
    >
      <div className="relative h-24 w-20 overflow-hidden rounded-2xl">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            {item.category}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-white">{item.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
            {item.size ? <span>Size: {item.size}</span> : null}
            {item.color ? <span>Color: {item.color}</span> : null}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-semibold text-white">{formatCurrency(item.price)}</p>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onDecrease}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white"
            >
              <Minus className="h-4 w-4" />
            </motion.button>

            <span className="min-w-6 text-center text-sm text-white">
              {item.quantity}
            </span>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onIncrease}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white"
            >
              <Plus className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onRemove}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}