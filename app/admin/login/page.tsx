import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const auth = await requireAdmin();

    if (auth.authorized) {
      redirect("/admin");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <div className="w-full">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Brand 2 Brands</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Admin Portal</h1>
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}