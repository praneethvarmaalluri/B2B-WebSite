import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ALLOWED = new Set([
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
]);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const formData = await request.formData();
  const order_status = String(formData.get("order_status") || "new");

  if (!ALLOWED.has(order_status)) {
    return NextResponse.redirect(new URL("/admin/orders", request.url));
  }

  await supabaseAdmin
    .from("orders")
    .update({ order_status })
    .eq("id", params.id);

  return NextResponse.redirect(new URL("/admin/orders", request.url));
}   