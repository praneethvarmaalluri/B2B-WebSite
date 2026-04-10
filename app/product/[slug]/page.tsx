import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { ProductDetailsContent } from "@/components/product-details-content";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ProductImageRow = {
  image_url: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
};

export default async function ProductPage({
  params
}: {
  params: { slug: string };
}) {
  const { data: product } = await supabaseAdmin
    .from("products")
    .select(`
      id,
      slug,
      name,
      description,
      price,
      discount_price,
      stock_quantity,
      sizes,
      colors,
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
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background text-foreground">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-card p-8 text-center">
              <h1 className="text-2xl font-bold text-white">Product not found</h1>
              <p className="mt-3 text-zinc-400">
                This product doesn’t exist, or the slug is wrong because humans typed things.
              </p>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppFloating />
        <MobileBottomNav />
      </>
    );
  }

  const rawCategory = Array.isArray(product.categories)
    ? product.categories[0]
    : product.categories;

  const category = rawCategory
    ? {
        id: rawCategory.id,
        name: rawCategory.name,
        slug: rawCategory.slug
      }
    : {
        id: "uncategorized",
        name: "Uncategorized",
        slug: "uncategorized"
      };

  const rawImages: ProductImageRow[] = Array.isArray(product.product_images)
    ? product.product_images
    : [];

  const images = [...rawImages]
    .filter((img) => img?.image_url && String(img.image_url).trim().length > 0)
    .sort((a, b) => {
      const aPrimary = a.is_primary ? 1 : 0;
      const bPrimary = b.is_primary ? 1 : 0;
      if (aPrimary !== bPrimary) return bPrimary - aPrimary;
      return (a.sort_order ?? 9999) - (b.sort_order ?? 9999);
    })
    .map((img) => String(img.image_url));

  const transformedProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category,
    description:
      product.description || `${product.name} from Brand 2 Brands Fashion Store.`,
    price: Number(product.price || 0),
    discountPrice:
      product.discount_price !== null && product.discount_price !== undefined
        ? Number(product.discount_price)
        : null,
    stockCount: Number(product.stock_quantity || 0),
    images: images.length > 0 ? images : ["/products/item1.jpeg"],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    featured: !!product.is_featured,
    trending: !!product.is_trending,
    bestSeller: !!product.is_bestseller,
    newArrival: !!product.is_new
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <ProductDetailsContent product={transformedProduct} />
      </main>
      <Footer />
      <WhatsAppFloating />
      <MobileBottomNav />
    </>
  );
}