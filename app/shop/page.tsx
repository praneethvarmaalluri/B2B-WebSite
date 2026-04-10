import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { ShopPageClient } from "@/components/shop-page-client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ShopPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),

    supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        short_description,
        description,
        price,
        discount_price,
        stock_quantity,
        is_featured,
        is_new,
        is_bestseller,
        is_trending,
        is_active,
        status,
        categories:category_id (
          id,
          name,
          slug
        ),
        product_images (
          image_url,
          is_primary,
          sort_order
        )
      `)
      .eq("is_active", true)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
  ]);

  const mappedProducts =
    (products || []).map((product: any) => {
      const rawCategory = Array.isArray(product.categories)
        ? product.categories[0]
        : product.categories;

      const rawImages = Array.isArray(product.product_images)
        ? product.product_images
        : [];

      const sortedImages = [...rawImages].sort((a, b) => {
        const aPrimary = a?.is_primary ? 1 : 0;
        const bPrimary = b?.is_primary ? 1 : 0;

        if (aPrimary !== bPrimary) return bPrimary - aPrimary;
        return (a?.sort_order ?? 9999) - (b?.sort_order ?? 9999);
      });

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || product.short_description || "",
        price: Number(product.price || 0),
        discountPrice:
          product.discount_price !== null && product.discount_price !== undefined
            ? Number(product.discount_price)
            : null,
        stockCount: Number(product.stock_quantity || 0),
        featured: !!product.is_featured,
        newArrival: !!product.is_new,
        bestSeller: !!product.is_bestseller,
        trending: !!product.is_trending,
        category: rawCategory
          ? {
              id: rawCategory.id,
              name: rawCategory.name,
              slug: rawCategory.slug
            }
          : {
              id: "uncategorized",
              name: "Uncategorized",
              slug: "uncategorized"
            },
        images: sortedImages.map((img: any) => img.image_url).filter(Boolean)
      };
    }) || [];

  const mappedCategories =
    (categories || []).map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug
    })) || [];

  return (
    <>
      <Header />
      <ShopPageClient products={mappedProducts} categories={mappedCategories} />
      <Footer />
      <WhatsAppFloating />
      <MobileBottomNav />
    </>
  );
}