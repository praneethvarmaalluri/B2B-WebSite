// lib/store/products.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon_name: string | null;
  sort_order: number;
  is_active: boolean;
  product_count?: number;
};

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  discount_price: number | null;
  stock_quantity: number;
  sku: string | null;
  sizes: string[];
  colors: string[];
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
  status: string;
  allow_cod: boolean;
  allow_online_payment: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: {
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }[];
};

function normalizeProduct(row: any): StoreProduct {
  const images = Array.isArray(row.product_images) ? row.product_images : [];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    short_description: row.short_description,
    description: row.description,
    price: Number(row.price ?? 0),
    compare_at_price:
      row.compare_at_price !== null && row.compare_at_price !== undefined
        ? Number(row.compare_at_price)
        : null,
    discount_price:
      row.discount_price !== null && row.discount_price !== undefined
        ? Number(row.discount_price)
        : null,
    stock_quantity: row.stock_quantity ?? 0,
    sku: row.sku,
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    is_active: row.is_active ?? true,
    is_featured: row.is_featured ?? false,
    is_new: row.is_new ?? false,
    is_bestseller: row.is_bestseller ?? false,
    is_hot_sale: row.is_hot_sale ?? false,
    is_trending: row.is_trending ?? false,
    is_limited_stock: row.is_limited_stock ?? false,
    is_premium_pick: row.is_premium_pick ?? false,
    is_festive_drop: row.is_festive_drop ?? false,
    is_staff_pick: row.is_staff_pick ?? false,
    status: row.status ?? "in_stock",
    allow_cod: row.allow_cod ?? true,
    allow_online_payment: row.allow_online_payment ?? true,
    sort_order: row.sort_order ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category: row.categories
      ? {
          id: row.categories.id,
          name: row.categories.name,
          slug: row.categories.slug
        }
      : null,
    images: images
      .sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      })
      .map((img: any) => ({
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text,
        is_primary: img.is_primary ?? false,
        sort_order: img.sort_order ?? 0
      }))
  };
}

export async function getActiveProducts() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizeProduct);
}

export async function getFeaturedProducts(limit = 8) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  const products = (data ?? []).map(normalizeProduct);

  if (products.length > 0) return products;

  return getLatestProducts(limit);
}

export async function getLatestProducts(limit = 8) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizeProduct);
}

export async function getProductBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return normalizeProduct(data);
}

export async function getActiveCategoriesWithCounts() {
  const supabase = await createServerSupabaseClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url, icon_name, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, category_id")
    .eq("is_active", true);

  if (productsError) {
    throw new Error(productsError.message);
  }

  const countMap = new Map<string, number>();

  for (const product of products ?? []) {
    if (!product.category_id) continue;
    countMap.set(product.category_id, (countMap.get(product.category_id) ?? 0) + 1);
  }

  return (categories ?? []).map((category) => ({
    ...category,
    product_count: countMap.get(category.id) ?? 0
  }));
}