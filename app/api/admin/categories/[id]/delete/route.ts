import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const categoryId = params.id;

  const { count } = await supabaseAdmin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if ((count || 0) > 0) {
    return NextResponse.redirect(
      new URL("/admin/categories?error=category-in-use", request.url)
    );
  }

  await supabaseAdmin.from("categories").delete().eq("id", categoryId);

  return NextResponse.redirect(new URL("/admin/categories", request.url));
}