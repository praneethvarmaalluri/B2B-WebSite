import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const formData = await request.formData();

  const payload = {
    store_name: String(formData.get("store_name") || ""),
    store_tagline: String(formData.get("store_tagline") || ""),
    whatsapp_number: String(formData.get("whatsapp_number") || ""),
    call_number: String(formData.get("call_number") || ""),
    email: String(formData.get("email") || ""),
    instagram_url: String(formData.get("instagram_url") || ""),
    google_maps_url: String(formData.get("google_maps_url") || ""),
    address: String(formData.get("address") || ""),
    shipping_note: String(formData.get("shipping_note") || ""),
    business_hours: String(formData.get("business_hours") || ""),
    cod_enabled: formData.get("cod_enabled") === "on",
    online_payment_enabled: formData.get("online_payment_enabled") === "on"
  };

  const { data: existing } = await supabaseAdmin
    .from("store_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    await supabaseAdmin
      .from("store_settings")
      .update(payload)
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("store_settings").insert(payload);
  }

  return NextResponse.redirect(new URL("/admin/store-settings", request.url));
}