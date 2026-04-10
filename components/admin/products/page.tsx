import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      discount_price,
      status,
      is_active,
      is_featured,
      is_new,
      is_bestseller,
      categories(name),
      product_images(image_url, is_primary)
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Admin / Products</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Manage Products</h1>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white"
          >
            + Add Product
          </Link>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-5 text-red-300">
            Failed to load products: {error.message}
          </div>
        ) : !products?.length ? (
          <div className="rounded-3xl border border-white/10 bg-card p-8 text-center text-zinc-400">
            No products yet. Time to feed the store.
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product: any) => {
              const primaryImage =
                product.product_images?.find((img: any) => img.is_primary)?.image_url ||
                product.product_images?.[0]?.image_url ||
                "/products/item1.jpg";

              const displayPrice = product.discount_price || product.price;

              return (
                <div
                  key={product.id}
                  className="rounded-3xl border border-white/10 bg-card p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-4">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="h-24 w-20 rounded-2xl object-cover"
                      />

                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          {product.categories?.name || "Uncategorized"}
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-white">{product.name}</h2>
                        <p className="mt-1 text-sm text-zinc-400">/{product.slug}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {product.is_featured ? (
                            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
                              Featured
                            </span>
                          ) : null}
                          {product.is_new ? (
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white">
                              New
                            </span>
                          ) : null}
                          {product.is_bestseller ? (
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white">
                              Bestseller
                            </span>
                          ) : null}
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            {product.status}
                          </span>
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            {product.is_active ? "Active" : "Hidden"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(Number(displayPrice))}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Original: {formatCurrency(Number(product.price))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}