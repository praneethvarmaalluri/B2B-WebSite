import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CategoryForm } from "@/components/admin/category-form";
import { Trash2 } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const { data: categories, error } = await supabaseAdmin
    .from("categories")
    .select("id, name, slug, is_active, sort_order")
    .order("sort_order", { ascending: true });

  const categoryIds = (categories || []).map((c) => c.id);

  let productCountsMap = new Map<string, number>();

  if (categoryIds.length > 0) {
    const { data: products } = await supabaseAdmin
      .from("products")
      .select("id, category_id")
      .in("category_id", categoryIds);

    for (const product of products || []) {
      const key = String(product.category_id || "");
      productCountsMap.set(key, (productCountsMap.get(key) || 0) + 1);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            Admin / Categories
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Manage Categories</h1>
        </div>
        <AdminNav />
        {searchParams?.error === "category-in-use" ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            This category cannot be deleted because it still has products assigned to it.
          </div>
        ) : null}

        <CategoryForm />

        <div className="mt-6 rounded-3xl border border-white/10 bg-card p-5">
          <h2 className="text-xl font-semibold text-white">Existing Categories</h2>

          {error ? (
            <p className="mt-4 text-red-400">Failed to load categories: {error.message}</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {categories?.map((category) => {
                const productCount = productCountsMap.get(category.id) || 0;

                return (
                  <div
                    key={category.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{category.name}</p>
                      <p className="text-sm text-zinc-500">/{category.slug}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        Sort: {category.sort_order}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        {category.is_active ? "Active" : "Hidden"}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        Products: {productCount}
                      </span>

                      <form
                        action={`/admin/categories/${category.id}/delete`}
                        method="POST"
                      >
                        <button
                          type="submit"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                          title="Delete category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}

              {!categories?.length ? (
                <p className="text-sm text-zinc-400">No categories found.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}