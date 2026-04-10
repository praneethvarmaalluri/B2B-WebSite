import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Brand 2 Brands Fashion Store",
    template: "%s | Brand 2 Brands"
  },
  description:
    "Premium fashion store for shirts, pants, sweatshirts, shoes, caps, watches, and handbags."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: {
              background: "#111111",
              color: "#F8F8F8",
              border: "1px solid #262626"
            }
          }}
        />
      </body>
    </html>
  );
}