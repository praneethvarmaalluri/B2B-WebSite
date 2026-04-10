"use client";

import Link from "next/link";
import { Home, ShoppingBag, Store, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { STORE_INFO } from "@/lib/constants";

export function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-xl md:hidden mobile-safe-bottom">
      <div className="grid grid-cols-4">
        <NavItem href="/" label="Home" icon={<Home className="h-5 w-5" />} />
        <NavItem href="/shop" label="Shop" icon={<Store className="h-5 w-5" />} />
        <NavItem href="/cart" label="Cart" icon={<ShoppingBag className="h-5 w-5" />} />
        <a
          href={`tel:${STORE_INFO.phone}`}
          className="flex flex-col items-center justify-center py-3 text-xs text-zinc-300"
        >
          <Phone className="mb-1 h-5 w-5" />
          Call
        </a>
      </div>
    </div>
  );
}

function NavItem({
  href,
  label,
  icon
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.92 }}
        className="flex flex-col items-center justify-center py-3 text-xs text-zinc-300"
      >
        <div className="mb-1">{icon}</div>
        {label}
      </motion.div>
    </Link>
  );
}