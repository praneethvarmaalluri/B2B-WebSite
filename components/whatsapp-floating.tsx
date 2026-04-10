"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { STORE_INFO } from "@/lib/constants";
import { generateWhatsAppUrl } from "@/lib/utils";

export function WhatsAppFloating() {
  const url = generateWhatsAppUrl(
    "Hi Brand 2 Brands Fashion Store, I want to know more about your products.",
    STORE_INFO.whatsapp
  );

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.92 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}