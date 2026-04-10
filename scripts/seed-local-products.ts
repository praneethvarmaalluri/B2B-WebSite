// scripts/seed-local-products.ts
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env.local")
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const categories = [
  { name: "Shirts", slug: "shirts", sort_order: 1 },
  { name: "Pants", slug: "pants", sort_order: 2 },
  { name: "Sweatshirts", slug: "sweatshirts", sort_order: 3 },
  { name: "Shoes", slug: "shoes", sort_order: 4 },
  { name: "Caps", slug: "caps", sort_order: 5 },
  { name: "Watches", slug: "watches", sort_order: 6 },
  { name: "Handbags", slug: "handbags", sort_order: 7 }
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductMeta(itemNumber: number) {
  if (itemNumber >= 1 && itemNumber <= 10) {
    return {
      categorySlug: "shirts",
      name: `Street Shirt ${itemNumber}`,
      price: 1499 + (itemNumber % 4) * 200,
      compareAt: 2299 + (itemNumber % 3) * 200,
      stockQuantity: 8 + (itemNumber % 5),
      isFeatured: itemNumber <= 4,
      isNew: itemNumber >= 7,
      isBestseller: itemNumber % 2 === 0,
      isTrending: itemNumber % 3 === 0
    };
  }

  if (itemNumber >= 11 && itemNumber <= 21) {
    return {
      categorySlug: "sweatshirts",
      name: `Premium Sweatshirt ${itemNumber - 10}`,
      price: 2199 + (itemNumber % 4) * 250,
      compareAt: 3199 + (itemNumber % 3) * 200,
      stockQuantity: 6 + (itemNumber % 4),
      isFeatured: itemNumber <= 14,
      isNew: itemNumber >= 18,
      isBestseller: itemNumber % 2 !== 0,
      isTrending: itemNumber % 3 === 0
    };
  }

  if (itemNumber >= 22 && itemNumber <= 27) {
    return {
      categorySlug: "shoes", // IMPORTANT: your DB uses shoes, not footwear
      name: `Urban Shoes ${itemNumber - 21}`,
      price: 1799 + (itemNumber % 3) * 300,
      compareAt: 2699 + (itemNumber % 2) * 300,
      stockQuantity: 5 + (itemNumber % 4),
      isFeatured: itemNumber <= 24,
      isNew: itemNumber >= 25,
      isBestseller: true,
      isTrending: true
    };
  }

  if (itemNumber >= 28 && itemNumber <= 30) {
    return {
      categorySlug: "caps",
      name: `Signature Cap ${itemNumber - 27}`,
      price: 699 + (itemNumber % 3) * 100,
      compareAt: 999 + (itemNumber % 2) * 100,
      stockQuantity: 10 + (itemNumber % 4),
      isFeatured: itemNumber === 28,
      isNew: itemNumber >= 29,
      isBestseller: false,
      isTrending: true
    };
  }

  if (itemNumber >= 31 && itemNumber <= 34) {
    return {
      categorySlug: "watches",
      name: `Classic Watch ${itemNumber - 30}`,
      price: 2499 + (itemNumber % 4) * 400,
      compareAt: 3999 + (itemNumber % 3) * 300,
      stockQuantity: 4 + (itemNumber % 3),
      isFeatured: itemNumber === 31,
      isNew: itemNumber >= 33,
      isBestseller: itemNumber % 2 === 0,
      isTrending: itemNumber % 2 === 0
    };
  }

  return {
    categorySlug: "handbags",
    name: `Luxury Handbag ${itemNumber - 34}`,
    price: 1899 + (itemNumber % 2) * 300,
    compareAt: 2999 + (itemNumber % 2) * 300,
    stockQuantity: 5 + (itemNumber % 2),
    isFeatured: true,
    isNew: true,
    isBestseller: false,
    isTrending: true
  };
}

async function upsertCategories() {
  const { error } = await supabase.from("categories").upsert(
    categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      sort_order: cat.sort_order,
      is_active: true
    })),
    { onConflict: "slug" }
  );

  if (error) throw error;

  const { data, error: fetchError } = await supabase
    .from("categories")
    .select("id, slug");

  if (fetchError) throw fetchError;

  return new Map((data ?? []).map((c) => [c.slug, c.id]));
}

async function seedProducts(categoryMap: Map<string, string>) {
  for (let i = 1; i <= 36; i++) {
    const meta = getProductMeta(i);
    const slug = slugify(`${meta.name}-${i}`);
    const imageUrl = `/products/item${i}.jpeg`;

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    let productId: string;

    if (existing?.id) {
      productId = existing.id;

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: meta.name,
          short_description: `Premium ${meta.categorySlug} collection`,
          description: `${meta.name} from Brand 2 Brands Fashion Store.`,
          category_id: categoryMap.get(meta.categorySlug)!,
          price: meta.price,
          compare_at_price: meta.compareAt,
          discount_price: null,
          stock_quantity: meta.stockQuantity,
          sku: `B2B-${String(i).padStart(3, "0")}`,
          sizes: [],
          colors: [],
          is_active: true,
          is_featured: meta.isFeatured,
          is_new: meta.isNew,
          is_bestseller: meta.isBestseller,
          is_hot_sale: false,
          is_trending: meta.isTrending,
          is_limited_stock: meta.stockQuantity <= 5,
          is_premium_pick: i % 5 === 0,
          is_festive_drop: false,
          is_staff_pick: i % 7 === 0,
          status: "in_stock",
          allow_cod: true,
          allow_online_payment: false,
          sort_order: i
        })
        .eq("id", productId);

      if (updateError) throw updateError;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("products")
        .insert({
          name: meta.name,
          slug,
          short_description: `Premium ${meta.categorySlug} collection`,
          description: `${meta.name} from Brand 2 Brands Fashion Store.`,
          category_id: categoryMap.get(meta.categorySlug)!,
          price: meta.price,
          compare_at_price: meta.compareAt,
          discount_price: null,
          stock_quantity: meta.stockQuantity,
          sku: `B2B-${String(i).padStart(3, "0")}`,
          sizes: [],
          colors: [],
          is_active: true,
          is_featured: meta.isFeatured,
          is_new: meta.isNew,
          is_bestseller: meta.isBestseller,
          is_hot_sale: false,
          is_trending: meta.isTrending,
          is_limited_stock: meta.stockQuantity <= 5,
          is_premium_pick: i % 5 === 0,
          is_festive_drop: false,
          is_staff_pick: i % 7 === 0,
          status: "in_stock",
          allow_cod: true,
          allow_online_payment: false,
          sort_order: i
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      productId = inserted.id;
    }

    const { data: existingImages } = await supabase
      .from("product_images")
      .select("id, is_primary")
      .eq("product_id", productId);

    if (!existingImages || existingImages.length === 0) {
      const { error: imageError } = await supabase.from("product_images").insert({
        product_id: productId,
        image_url: imageUrl,
        cloudinary_public_id: null,
        alt_text: meta.name,
        is_primary: true,
        sort_order: 0
      });

      if (imageError) throw imageError;
    } else {
      const primary = existingImages.find((img) => img.is_primary);

      if (primary) {
        const { error: imageUpdateError } = await supabase
          .from("product_images")
          .update({
            image_url: imageUrl,
            alt_text: meta.name,
            sort_order: 0
          })
          .eq("id", primary.id);

        if (imageUpdateError) throw imageUpdateError;
      } else {
        const { error: imageInsertError } = await supabase.from("product_images").insert({
          product_id: productId,
          image_url: imageUrl,
          cloudinary_public_id: null,
          alt_text: meta.name,
          is_primary: true,
          sort_order: 0
        });

        if (imageInsertError) throw imageInsertError;
      }
    }

    console.log(`Seeded item${i} -> ${meta.name}`);
  }
}

async function main() {
  console.log("Seeding Brand 2 Brands local products...");

  const categoryMap = await upsertCategories();
  await seedProducts(categoryMap);

  console.log("Done. Your shop is finally real.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});