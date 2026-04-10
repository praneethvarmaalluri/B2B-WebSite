import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateEffectivePrice(
  price: number,
  discountPrice?: number | null
) {
  return discountPrice && discountPrice > 0 ? discountPrice : price;
}

export function generateWhatsAppUrl(message: string, phone: string) {
  const cleanPhone = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/91${cleanPhone}?text=${encoded}`;
}

export function getSafeImageSrc(src?: string | null) {
  if (!src) return "/products/item1.jpeg";

  if (src.startsWith("/")) {
    return src;
  }

  try {
    const url = new URL(src);

    const allowedHosts = [
      "res.cloudinary.com",
      "images.unsplash.com"
    ];

    if (allowedHosts.includes(url.hostname)) {
      return src;
    }

    return "/products/item1.jpeg";
  } catch {
    return "/products/item1.jpeg";
  }
}