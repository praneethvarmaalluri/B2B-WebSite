"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Globe } from "lucide-react";

export function AdminNav() {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <Link
        href="/admin"
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white"
      >
        <LayoutDashboard className="h-4 w-4" />
        Admin Home
      </Link>

      <Link
        href="/"
        target="_blank"
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white"
      >
        <Globe className="h-4 w-4" />
        Open Website
      </Link>
    </div>
  );
}