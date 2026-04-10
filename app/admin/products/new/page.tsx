// app/admin/products/new/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const { data: categories, error } = await supabaseAdmin
    .from("categories")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-red-400">Failed to load categories: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Admin / Products</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Create New Product</h1>
          </div>

          <Link
            href="/admin/products"
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white"
          >
            Back to Products
          </Link>
        </div>

        <ProductForm categories={categories || []} />
      </div>
    </main>
  );
}