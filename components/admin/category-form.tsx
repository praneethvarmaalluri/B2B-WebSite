"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toast } from "sonner";

export function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(result.error || "Failed to create category");
      return;
    }

    toast.success("Category created");
    setName("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-card p-5">
      <h2 className="text-xl font-semibold text-white">Add Category</h2>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AnimatedButton type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </AnimatedButton>
      </div>
    </form>
  );
}