"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Product, Category } from "@/lib/types";

type SortOption = "featured" | "price-low" | "price-high" | "newest";

interface ShopPageClientProps {
  products: Product[];
  categories: Category[];
}

export function ShopPageClient({
  products,
  categories
}: ShopPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((product) => {
        const categoryName =
          typeof product.category === "string"
            ? product.category
            : product.category?.name || "";

        return (
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          categoryName.toLowerCase().includes(q)
        );
      });
    }

    if (selectedCategory !== "all") {
      result = result.filter((product) => {
        const categorySlug =
          typeof product.category === "string"
            ? product.category.toLowerCase().replace(/\s+/g, "-")
            : product.category?.slug;

        return categorySlug === selectedCategory;
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;

      case "price-high":
        result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;

      case "newest":
        result.sort((a, b) => Number(!!b.newArrival) - Number(!!a.newArrival));
        break;

      case "featured":
      default:
        result.sort((a, b) => {
          const aScore =
            (a.featured ? 4 : 0) +
            (a.bestSeller ? 3 : 0) +
            (a.trending ? 2 : 0) +
            (a.newArrival ? 1 : 0);

          const bScore =
            (b.featured ? 4 : 0) +
            (b.bestSeller ? 3 : 0) +
            (b.trending ? 2 : 0) +
            (b.newArrival ? 1 : 0);

          return bScore - aScore;
        });
        break;
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <PageContainer>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Brand 2 Brands Collection
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Shop All Products
            </h1>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Explore premium fashion pieces curated for modern style.
            </p>
          </div>

          <AnimatedButton
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </AnimatedButton>
        </div>

        <div
          className={`mb-8 rounded-3xl border border-white/10 bg-card p-4 sm:p-5 ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 text-white outline-none transition focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none transition focus:border-accent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none transition focus:border-accent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            Showing <span className="font-semibold text-white">{filteredProducts.length}</span> products
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-card px-6 py-14 text-center">
            <h3 className="text-xl font-semibold text-white">No products found</h3>
            <p className="mt-2 text-sm text-zinc-400">Try changing your search or filters.</p>
          </div>
        )}
      </PageContainer>
    </section>
  );
}