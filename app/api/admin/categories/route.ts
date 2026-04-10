import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body?.name || "").trim();

  if (!name) {
    return NextResponse.json(
      { error: "Category name is required." },
      { status: 400 }
    );
  }

  const slug = slugify(name);

  const { data: existing } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Category with same name already exists." },
      { status: 409 }
    );
  }

  const { error } = await supabaseAdmin.from("categories").insert({
    name,
    slug,
    is_active: true,
    sort_order: 0
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}