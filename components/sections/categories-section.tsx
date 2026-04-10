import Link from "next/link";
import { getActiveCategoriesWithCounts } from "@/lib/store/products";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const CATEGORY_DESCRIPTION_MAP: Record<string, string> = {
  shirts: "Bold everyday fits",
  pants: "Sharp and relaxed styles",
  sweatshirts: "Premium street layers",
  shoes: "Style from the ground up",
  caps: "Minimal statement pieces",
  watches: "Timeless accessories",
  handbags: "Functional luxury picks"
};

export async function CategoriesSection() {
  const categories = await getActiveCategoriesWithCounts();

  if (!categories.length) {
    return null;
  }

  return (
    <section className="section-padding">
      <PageContainer>
        <SectionHeading
          eyebrow="Explore"
          title="Shop by Category"
          description="Browse premium collections crafted for style, comfort, and everyday confidence."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <Link
                href={`/shop?category=${encodeURIComponent(category.slug)}`}
                className="group block rounded-3xl border border-white/10 bg-card p-5 transition-all active:scale-[0.985] md:hover:border-accent/30"
              >
                <div className="h-1 w-12 rounded-full bg-accent" />

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  {category.description ||
                    CATEGORY_DESCRIPTION_MAP[category.slug] ||
                    "Explore the latest collection"}
                </p>

                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-accent">
                  {category.product_count || 0} Products
                </p>
              </Link>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}