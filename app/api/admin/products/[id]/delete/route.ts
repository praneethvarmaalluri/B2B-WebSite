import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();

  if (!auth.authorized || !auth.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const productId = params.id;

  const { data: imageRows } = await supabaseAdmin
    .from("product_images")
    .select("id")
    .eq("product_id", productId);

  if (imageRows?.length) {
    await supabaseAdmin.from("product_images").delete().eq("product_id", productId);
  }

  await supabaseAdmin.from("products").delete().eq("id", productId);

  return NextResponse.redirect(new URL("/admin/products", request.url));
}