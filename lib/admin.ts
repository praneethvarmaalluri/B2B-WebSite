import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function isCurrentUserAdmin() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return false;
  }

  const { data: adminRow, error } = await supabase
    .from("admins")
    .select("id, email, role, is_active")
    .eq("email", user.email)
    .eq("is_active", true)
    .single();

  if (error || !adminRow) {
    return false;
  }

  return true;
}

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { authorized: false, user: null };
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("id, email, role, is_active")
    .eq("email", user.email)
    .eq("is_active", true)
    .single();

  if (!adminRow) {
    return { authorized: false, user };
  }

  return { authorized: true, user, admin: adminRow };
}