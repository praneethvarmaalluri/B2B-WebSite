import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminProductsPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/");
  }

  const { data: products } = await supabaseAdmin
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      discount_price,
      stock_quantity,
      status,
      is_active,
      is_featured,
      is_new,
      is_bestseller,
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
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-bold">Products</h1>
          </div>

          <Link href="/admin/products/new">
            <AnimatedButton>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </AnimatedButton>
          </Link>
        </div>
        <AdminNav />
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-card">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-zinc-400">
                <tr>
                  <th className="px-4 py-4 text-left">Image</th>
                  <th className="px-4 py-4 text-left">Product</th>
                  <th className="px-4 py-4 text-left">Category</th>
                  <th className="px-4 py-4 text-left">Price</th>
                  <th className="px-4 py-4 text-left">Stock</th>
                  <th className="px-4 py-4 text-left">Status</th>
                  <th className="px-4 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {(products || []).map((product: any) => {
                  const rawCategory = Array.isArray(product.categories)
                    ? product.categories[0]
                    : product.categories;

                  type AdminProductImage = {
  image_url: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
};

const rawImages: AdminProductImage[] = Array.isArray(product.product_images)
  ? product.product_images
  : [];

const image = [...rawImages]
  .sort((a: AdminProductImage, b: AdminProductImage) => {
    const aPrimary = a.is_primary ? 1 : 0;
    const bPrimary = b.is_primary ? 1 : 0;

    if (aPrimary !== bPrimary) return bPrimary - aPrimary;

    return (a.sort_order ?? 9999) - (b.sort_order ?? 9999);
  })[0]?.image_url || "/products/item1.jpeg";

                  return (
                    <tr key={product.id} className="border-b border-white/5">
                      <td className="px-4 py-4">
                        <div className="relative h-16 w-14 overflow-hidden rounded-xl border border-white/10">
                          <Image src={image} alt={product.name} fill className="object-cover" unoptimized />
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-zinc-500">{product.slug}</div>
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        {rawCategory?.name || "Uncategorized"}
                      </td>

                      <td className="px-4 py-4">
                        ₹{Number(product.discount_price ?? product.price ?? 0).toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-4">{product.stock_quantity ?? 0}</td>

                      <td className="px-4 py-4">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                          {product.status || "draft"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <form action={`/api/admin/products/${product.id}/delete`} method="POST">
                            <button
                              type="submit"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}