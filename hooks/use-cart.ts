"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/lib/cart-types";

type CartStore = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
};

function isSameVariant(
  item: CartItem,
  productId: string,
  size?: string,
  color?: string
) {
  return (
    item.productId === productId &&
    (item.size || "") === (size || "") &&
    (item.color || "") === (color || "")
  );
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addToCart: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex((item) =>
            isSameVariant(item, newItem.productId, newItem.size, newItem.color)
          );

          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + newItem.quantity
            };
            return { items: updated };
          }

          return { items: [...state.items, newItem] };
        }),

      removeFromCart: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameVariant(item, productId, size, color)
          )
        })),

      updateQuantity: (productId, quantity, size, color) =>
        set((state) => ({
          items: state.items.map((item) =>
            isSameVariant(item, productId, size, color)
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        })),

      clearCart: () => set({ items: [] })
    }),
    {
      name: "brand2-cart"
    }
  )
);