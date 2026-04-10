"use client";

import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";

export function PromoBanner() {
  return (
    <section className="py-5">
      <PageContainer>
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0.9, y: 16 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-accent/20 bg-accent/10 px-5 py-4 text-center md:flex-row md:text-left"
        >
          <div>
            <p className="text-sm font-semibold text-white">
              New stock arrives regularly. Stay ready for the latest drops.
            </p>
            <p className="text-xs text-zinc-300 md:text-sm">
              Fresh collections, trending fits, and premium accessories.
            </p>
          </div>
          <div className="rounded-full border border-accent/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            300 Days Fresh Stock
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}