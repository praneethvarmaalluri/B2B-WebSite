import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EditProductForm } from "@/components/admin/edit-product-form";

export default async function EditProductPage({
  params
}: {
  params: { id: string };
}) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/");
  }

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabaseAdmin
      .from("categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),

    supabaseAdmin
      .from("products")
      .select(`
        id,
        name,
        slug,
        short_description,
        description,
        category_id,
        price,
        compare_at_price,
        discount_price,
        stock_quantity,
        sku,
        sizes,
        colors,
        status,
        allow_cod,
        allow_online_payment,
        sort_order,
        is_active,
        is_featured,
        is_new,
        is_bestseller,
        is_hot_sale,
        is_trending,
        is_limited_stock,
        is_premium_pick,
        is_festive_drop,
        is_staff_pick,
        product_images (
          id,
          image_url,
          is_primary,
          sort_order
        )
      `)
      .eq("id", params.id)
      .single()
  ]);

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Admin</p>
          <h1 className="mt-2 text-3xl font-bold">Edit Product</h1>
        </div>

        <EditProductForm
          categories={categories || []}
          product={product as any}
        />
      </div>
    </div>
  );
}