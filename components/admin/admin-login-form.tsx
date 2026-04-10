"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toast } from "sonner";

export function AdminLoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Admin login successful");
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="rounded-3xl border border-white/10 bg-card p-6">
      <h2 className="text-2xl font-bold text-white">Admin Login</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Sign in to manage products, orders, categories, and store settings.
      </p>

      <div className="mt-6 space-y-4">
        <Input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <AnimatedButton type="submit" fullWidth disabled={loading}>
          {loading ? "Signing in..." : "Login to Admin"}
        </AnimatedButton>
      </div>
    </form>
  );
}