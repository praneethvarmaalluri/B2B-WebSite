// lib/admin-constants.ts

export const PRODUCT_STATUS_OPTIONS = [
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" }
];

export const PRODUCT_TAG_FIELDS = [
  { key: "is_featured", label: "Featured" },
  { key: "is_new", label: "New Arrival" },
  { key: "is_bestseller", label: "Best Seller" },
  { key: "is_hot_sale", label: "Hot Sale" },
  { key: "is_trending", label: "Trending" },
  { key: "is_limited_stock", label: "Limited Stock" },
  { key: "is_premium_pick", label: "Premium Pick" },
  { key: "is_festive_drop", label: "Festive Drop" },
  { key: "is_staff_pick", label: "Staff Pick" }
] as const;

export const LOCAL_PRODUCT_IMAGE_OPTIONS = Array.from({ length: 36 }, (_, index) => {
  const number = index + 1;
  return {
    label: `Item ${number}`,
    value: `/products/item${number}.jpeg`
  };
});