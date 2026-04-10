"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, PhoneCall } from "lucide-react";
import { BRAND, STORE_INFO } from "@/lib/constants";
import { PageContainer } from "@/components/layout/page-container";
import { AnimatedButton } from "@/components/ui/animated-button";
import { generateWhatsAppUrl } from "@/lib/utils";

export function HeroSection() {
  const whatsappUrl = generateWhatsAppUrl(
    "Hi Brand 2 Brands Fashion Store, I want to explore your latest collection.",
    STORE_INFO.whatsapp
  );

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-hero-gradient">
      <PageContainer className="grid min-h-[85vh] items-center gap-10 py-12 md:grid-cols-2 md:py-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent"
          >
            {BRAND.shortName}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl font-bold leading-tight text-white md:text-6xl"
          >
            Wear the
            <span className="text-accent"> Brand.</span>
            <br />
            Own the Look.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-5 max-w-xl text-sm leading-7 text-zinc-300 md:text-base"
          >
            Premium fashion and accessories curated for standout style. Explore
            shirts, pants, sweatshirts, shoes, caps, watches, and handbags with
            a bold streetwear-inspired vibe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/shop">
              <AnimatedButton className="w-full sm:w-auto">
                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </Link>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <AnimatedButton variant="outline" className="w-full sm:w-auto">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Order
              </AnimatedButton>
            </a>

            <a href={`tel:${STORE_INFO.phone}`}>
              <AnimatedButton variant="secondary" className="w-full sm:w-auto">
                <PhoneCall className="mr-2 h-4 w-4" />
                Call Store
              </AnimatedButton>
            </a>
          </motion.div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <StatBox label="Categories" value="7+" />
            <StatBox label="Fresh Drops" value="300 Days" />
            <StatBox label="Fast Support" value="WhatsApp" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-accent/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-4">
              <FeatureTile title="Premium Fits" subtitle="Streetwear inspired" />
              <FeatureTile title="Latest Stock" subtitle="Frequent arrivals" />
              <FeatureTile title="Direct Orders" subtitle="WhatsApp + Cart" />
              <FeatureTile title="Bold Accessories" subtitle="Style add-ons" />
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
      <p className="text-lg font-bold text-white md:text-xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </p>
    </div>
  );
}

function FeatureTile({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card p-5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-xs text-zinc-400">{subtitle}</p>
    </div>
  );
}