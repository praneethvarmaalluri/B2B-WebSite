import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
export default async function AdminDashboardPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const [
    { count: productCount },
    { count: activeProductCount },
    { count: categoryCount },
    { count: orderCount },
    { count: newOrderCount },
    { data: recentOrders }
  ] = await Promise.all([
    supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("status", "published"),
    supabaseAdmin.from("categories").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("order_status", "new"),
    supabaseAdmin
      .from("orders")
      .select("id, order_number, customer_name, total_amount, order_status, created_at")
      .order("created_at", { ascending: false })
      .limit(6)
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Manage products, categories, orders, and store settings.
            </p>
          </div>
          <AdminNav />
          <form action="/auth/signout" method="post">
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white">
              Sign out
            </button>
          </form>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Products", value: productCount || 0, desc: `${activeProductCount || 0} active`, href: "/admin/products" },
            { title: "Categories", value: categoryCount || 0, desc: "Manage collections", href: "/admin/categories" },
            { title: "Orders", value: orderCount || 0, desc: `${newOrderCount || 0} new`, href: "/admin/orders" },
            { title: "Store Settings", value: "1", desc: "Brand details", href: "/admin/store-settings" }
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-3xl border border-white/10 bg-card p-5 transition-colors hover:border-accent/30"
            >
              <p className="text-sm text-zinc-400">{item.title}</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{item.value}</h2>
              <p className="mt-2 text-sm text-zinc-500">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent">
              View all
            </Link>
          </div>

          {!recentOrders?.length ? (
            <p className="mt-4 text-sm text-zinc-400">No orders yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{order.order_number}</p>
                    <p className="text-sm text-zinc-400">{order.customer_name}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                      {order.order_status}
                    </span>
                    <span className="font-semibold text-white">
                      {formatCurrency(Number(order.total_amount || 0))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}