import Link from "next/link";
import { BRAND, STORE_INFO } from "@/lib/constants";
import { PageContainer } from "@/components/layout/page-container";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <PageContainer className="grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-white">{BRAND.shortName}</h3>
          <p className="mt-2 text-sm text-zinc-400">{BRAND.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Quick Links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Store Info</h4>
          <div className="mt-3 space-y-2 text-sm text-zinc-400">
            <p>{STORE_INFO.address}</p>
            <p>Phone: {STORE_INFO.phone}</p>
            <a href={STORE_INFO.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </PageContainer>

      <div className="border-t border-white/5 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  );
}