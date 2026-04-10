import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const categoryId = params.id;

  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error("Delete category error:", error);
  }

  return NextResponse.redirect(new URL("/admin/categories", request.url));
}