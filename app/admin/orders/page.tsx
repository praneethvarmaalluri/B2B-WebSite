import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";

type OrderItem = {
  id: string;
  product_name_snapshot: string;
  quantity: number;
  price_snapshot: number;
  line_total: number;
  size?: string | null;
  color?: string | null;
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  created_at: string;
  order_items?: OrderItem[];
};

const STATUS_OPTIONS = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];

export default async function AdminOrdersPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      order_number,
      customer_name,
      customer_phone,
      customer_email,
      address_line,
      city,
      state,
      pincode,
      payment_method,
      payment_status,
      order_status,
      total_amount,
      created_at,
      order_items (
        id,
        product_name_snapshot,
        quantity,
        price_snapshot,
        line_total,
        size,
        color
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Admin</p>
          <h1 className="mt-2 text-3xl font-bold">Orders</h1>
        </div>
        <AdminNav />
        {error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            Failed to load orders: {error.message}
          </div>
        ) : !orders?.length ? (
          <div className="rounded-3xl border border-white/10 bg-card p-8 text-zinc-400">
            No orders yet. Humanity has not started spending money.
          </div>
        ) : (
          <div className="space-y-5">
            {(orders as OrderRow[]).map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-white/10 bg-card p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{order.order_number}</h2>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                        {order.order_status}
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                        {order.payment_method}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-400">
                      {new Date(order.created_at).toLocaleString("en-IN")}
                    </p>

                    <div className="mt-4 space-y-1 text-sm text-zinc-300">
                      <p><span className="text-white font-medium">Customer:</span> {order.customer_name}</p>
                      <p><span className="text-white font-medium">Phone:</span> {order.customer_phone}</p>
                      {order.customer_email ? (
                        <p><span className="text-white font-medium">Email:</span> {order.customer_email}</p>
                      ) : null}
                      <p>
                        <span className="text-white font-medium">Address:</span>{" "}
                        {[order.address_line, order.city, order.state, order.pincode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <div className="text-right">
                      <p className="text-sm text-zinc-400">Total</p>
                      <p className="text-2xl font-bold text-accent">
                        {formatCurrency(Number(order.total_amount || 0))}
                      </p>
                    </div>

                    <form
                      action={`/api/admin/orders/${order.id}/status`}
                      method="POST"
                      className="flex flex-wrap items-center gap-2"
                    >
                      <select
                        name="order_status"
                        defaultValue={order.order_status}
                        className="h-10 rounded-2xl border border-white/10 bg-black/40 px-3 text-sm text-white"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        type="submit"
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white"
                      >
                        Update
                      </button>
                    </form>

                    <div className="flex gap-2">
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="rounded-2xl border border-white/10 px-4 py-2 text-sm"
                      >
                        Call
                      </a>
                      <a
                        href={`https://wa.me/91${order.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi ${order.customer_name}, regarding your order ${order.order_number} from Brand 2 Brands.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-300"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="mb-3 text-sm font-semibold text-white">Order Items</p>

                  <div className="space-y-3">
                    {(order.order_items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 rounded-2xl border border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium text-white">{item.product_name_snapshot}</p>
                          <p className="text-xs text-zinc-400">
                            Qty: {item.quantity}
                            {item.size ? ` • Size: ${item.size}` : ""}
                            {item.color ? ` • Color: ${item.color}` : ""}
                          </p>
                        </div>

                        <div className="text-sm text-zinc-300">
                          {formatCurrency(Number(item.line_total || 0))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}