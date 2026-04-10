import { ProductCard } from "@/components/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ProductImageRow = {
  image_url: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
};

export async function FeaturedSection() {
  const { data } = await supabaseAdmin
    .from("products")
    .select(`
      id,
      slug,
      name,
      description,
      price,
      discount_price,
      stock_quantity,
      is_featured,
      is_trending,
      is_bestseller,
      is_new,
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
    .eq("is_featured", true)
    .limit(8);

  const products =
    data?.map((product: any) => {
      const rawCategory = Array.isArray(product.categories)
        ? product.categories[0]
        : product.categories;

      const category = rawCategory
        ? { id: rawCategory.id, name: rawCategory.name, slug: rawCategory.slug }
        : { id: "uncategorized", name: "Uncategorized", slug: "uncategorized" };

      const rawImages: ProductImageRow[] = Array.isArray(product.product_images)
        ? product.product_images
        : [];

      const images = rawImages
        .filter((img) => img?.image_url && String(img.image_url).trim().length > 0)
        .sort((a, b) => {
          const aPrimary = a.is_primary ? 1 : 0;
          const bPrimary = b.is_primary ? 1 : 0;
          if (aPrimary !== bPrimary) return bPrimary - aPrimary;
          return (a.sort_order ?? 9999) - (b.sort_order ?? 9999);
        })
        .map((img) => String(img.image_url));

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        category,
        description: product.description || "",
        price: Number(product.price || 0),
        discountPrice:
          product.discount_price !== null && product.discount_price !== undefined
            ? Number(product.discount_price)
            : null,
        stockCount: Number(product.stock_quantity || 0),
        images: images.length ? images : ["/products/item1.jpeg"],
        sizes: [],
        colors: [],
        featured: !!product.is_featured,
        trending: !!product.is_trending,
        bestSeller: !!product.is_bestseller,
        newArrival: !!product.is_new
      };
    }) || [];

  return (
    <section className="section-padding">
      <PageContainer>
        <SectionHeading
          eyebrow="Featured"
          title="Trending Picks"
          description="Handpicked premium pieces from the latest collection."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}