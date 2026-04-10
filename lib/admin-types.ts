export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
};

export type UploadedProductImage = {
  url: string;
  public_id?: string | null;
  alt_text?: string;
};

export type ProductFormPayload = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;

  price: number;
  compare_at_price: number | null;
  discount_price: number | null;
  stock_quantity: number;
  sku: string;

  sizes: string[];
  colors: string[];

  status: "published" | "draft" | "archived" | string;
  sort_order: number;

  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_hot_sale: boolean;
  is_trending: boolean;
  is_limited_stock: boolean;
  is_premium_pick: boolean;
  is_festive_drop: boolean;
  is_staff_pick: boolean;

  allow_cod: boolean;
  allow_online_payment: boolean;

  // Used by edit form
  image_url?: string;

  // Used by create form
  images: UploadedProductImage[];
};