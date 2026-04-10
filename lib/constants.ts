export const BRAND = {
  name: "B2B",
  shortName: "B2B",
  fullName: "Brand 2 Brands",
  tagline: "Premium fashion curated for modern style.",
  description:
    "Discover premium shirts, pants, sweatshirts, shoes, caps, watches, handbags, and more with a sleek shopping experience built for modern customers.",
} as const;

export const STORE_INFO = {
  phone: process.env.NEXT_PUBLIC_STORE_PHONE || "+91 9030729233",
  whatsapp: process.env.NEXT_PUBLIC_STORE_WHATSAPP || "+91 9030729233",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL || "avspraneeth5@gmail.com",
  instagram:
    process.env.NEXT_PUBLIC_STORE_INSTAGRAM ||
    "https://www.instagram.com/brand2brands_official?igsh=MXBud20zZjA2MTl4ZA==",
  mapLink:
    process.env.NEXT_PUBLIC_STORE_MAP_LINK ||
    "https://maps.app.goo.gl/kQv8VZCCSUVmfHPc7",
  address:
    process.env.NEXT_PUBLIC_STORE_ADDRESS ||
    "Brand 2 Brands Store, Pedda Waltair, Visakhapatnam, Andhra Pradesh 530017",
} as const;

export const PRODUCT_CATEGORIES = [
  { name: "Shirts", slug: "shirts", description: "Bold everyday fits" },
  { name: "Pants", slug: "pants", description: "Sharp and relaxed styles" },
  { name: "Sweatshirts", slug: "sweatshirts", description: "Premium street layers" },
  { name: "Shoes", slug: "shoes", description: "Style from the ground up" },
  { name: "Caps", slug: "caps", description: "Minimal statement pieces" },
  { name: "Watches", slug: "watches", description: "Timeless accessories" },
  { name: "Handbags", slug: "handbags", description: "Functional luxury picks" }
];