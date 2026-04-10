import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminStoreSettingsPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const { data: settings } = await supabaseAdmin
    .from("store_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const store = settings || {
    store_name: "Brand 2 Brands Fashion Store",
    store_tagline: "Wear the Brand. Own the Look.",
    whatsapp_number: "9030729233",
    call_number: "9030729233",
    email: "avspraneeth5@gmail.com",
    instagram_url: "",
    google_maps_url: "",
    address: "",
    cod_enabled: true,
    online_payment_enabled: false,
    shipping_note: "",
    business_hours: ""
  };

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Admin</p>
          <h1 className="mt-2 text-3xl font-bold">Store Settings</h1>
        </div>
        <AdminNav />

        <form
          action="/api/admin/store-settings"
          method="POST"
          className="space-y-6 rounded-3xl border border-white/10 bg-card p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="store_name"
              defaultValue={store.store_name || ""}
              placeholder="Store Name"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white"
            />
            <input
              name="store_tagline"
              defaultValue={store.store_tagline || ""}
              placeholder="Store Tagline"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white"
            />
            <input
              name="whatsapp_number"
              defaultValue={store.whatsapp_number || ""}
              placeholder="WhatsApp Number"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white"
            />
            <input
              name="call_number"
              defaultValue={store.call_number || ""}
              placeholder="Call Number"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white"
            />
            <input
              name="email"
              defaultValue={store.email || ""}
              placeholder="Store Email"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white"
            />
            <input
              name="instagram_url"
              defaultValue={store.instagram_url || ""}
              placeholder="Instagram URL"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white"
            />
            <input
              name="google_maps_url"
              defaultValue={store.google_maps_url || ""}
              placeholder="Google Maps URL"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white sm:col-span-2"
            />
            <textarea
              name="address"
              defaultValue={store.address || ""}
              placeholder="Store Address"
              className="min-h-[110px] rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white sm:col-span-2"
            />
            <textarea
              name="shipping_note"
              defaultValue={store.shipping_note || ""}
              placeholder="Shipping Note"
              className="min-h-[100px] rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
            />
            <textarea
              name="business_hours"
              defaultValue={store.business_hours || ""}
              placeholder="Business Hours"
              className="min-h-[100px] rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 p-4">
              <input
                type="checkbox"
                name="cod_enabled"
                defaultChecked={!!store.cod_enabled}
              />
              <span>Cash on Delivery Enabled</span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 p-4">
              <input
                type="checkbox"
                name="online_payment_enabled"
                defaultChecked={!!store.online_payment_enabled}
              />
              <span>Online Payment Enabled</span>
            </label>
          </div>

          <button
            type="submit"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-white"
          >
            Save Store Settings
          </button>
        </form>
      </div>
    </main>
  );
}