"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedButton } from "@/components/ui/animated-button";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import {
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_TAG_FIELDS
} from "@/lib/admin-constants";
import type { ProductFormPayload } from "@/lib/admin-types";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductImageRow = {
  id?: string;
  image_url: string;
  cloudinary_public_id?: string | null;
  alt_text?: string | null;
  is_primary?: boolean | null;
  sort_order?: number | null;
};

type UploadedProductImage = {
  url: string;
  public_id?: string | null;
  alt_text?: string;
};

type EditProduct = {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  category_id: string;
  price: number;
  compare_at_price?: number | null;
  discount_price?: number | null;
  stock_quantity: number;
  sku?: string | null;
  sizes?: string[] | null;
  colors?: string[] | null;
  status?: string | null;
  allow_cod?: boolean | null;
  allow_online_payment?: boolean | null;
  sort_order?: number | null;
  is_active?: boolean | null;
  is_featured?: boolean | null;
  is_new?: boolean | null;
  is_bestseller?: boolean | null;
  is_hot_sale?: boolean | null;
  is_trending?: boolean | null;
  is_limited_stock?: boolean | null;
  is_premium_pick?: boolean | null;
  is_festive_drop?: boolean | null;
  is_staff_pick?: boolean | null;
  product_images?: ProductImageRow[] | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function EditProductForm({
  categories,
  product
}: {
  categories: Category[];
  product: EditProduct;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialImages: UploadedProductImage[] = useMemo(() => {
    const rawImages = Array.isArray(product.product_images) ? product.product_images : [];

    return [...rawImages]
      .filter((img) => img?.image_url)
      .sort((a, b) => {
        const aPrimary = a?.is_primary ? 1 : 0;
        const bPrimary = b?.is_primary ? 1 : 0;

        if (aPrimary !== bPrimary) return bPrimary - aPrimary;
        return (a?.sort_order ?? 9999) - (b?.sort_order ?? 9999);
      })
      .map((img) => ({
        url: img.image_url,
        public_id: img.cloudinary_public_id || null,
        alt_text: img.alt_text || product.name || "Product image"
      }));
  }, [product]);

  const [form, setForm] = useState<ProductFormPayload>({
    name: product.name || "",
    slug: product.slug || "",
    short_description: product.short_description || "",
    description: product.description || "",
    category_id: product.category_id || categories[0]?.id || "",
    price: Number(product.price || 0),
    compare_at_price: product.compare_at_price ?? null,
    discount_price: product.discount_price ?? null,
    stock_quantity: Number(product.stock_quantity || 0),
    sku: product.sku || "",
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    status: product.status || "published",
    allow_cod: !!product.allow_cod,
    allow_online_payment: !!product.allow_online_payment,
    sort_order: Number(product.sort_order || 0),
    is_active: !!product.is_active,
    is_featured: !!product.is_featured,
    is_new: !!product.is_new,
    is_bestseller: !!product.is_bestseller,
    is_hot_sale: !!product.is_hot_sale,
    is_trending: !!product.is_trending,
    is_limited_stock: !!product.is_limited_stock,
    is_premium_pick: !!product.is_premium_pick,
    is_festive_drop: !!product.is_festive_drop,
    is_staff_pick: !!product.is_staff_pick,
    images: initialImages
  });

  const [sizesInput, setSizesInput] = useState(
    Array.isArray(product.sizes) ? product.sizes.join(", ") : ""
  );
  const [colorsInput, setColorsInput] = useState(
    Array.isArray(product.colors) ? product.colors.join(", ") : ""
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function updateField<K extends keyof ProductFormPayload>(
    key: K,
    value: ProductFormPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    const invalidFile = fileArray.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      toast.error(`"${invalidFile.name}" is not a valid image file.`);
      return;
    }

    const tooLarge = fileArray.find((file) => file.size > 8 * 1024 * 1024);
    if (tooLarge) {
      toast.error(`"${tooLarge.name}" is too large. Max 8MB per image.`);
      return;
    }

    setUploadingImages(true);

    try {
      const formData = new FormData();

      fileArray.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Image upload failed");
        return;
      }

      const uploadedImages: UploadedProductImage[] = (result.files || []).map(
        (file: {
          url: string;
          public_id: string;
          original_filename?: string;
        }) => ({
          url: file.url,
          public_id: file.public_id,
          alt_text: file.original_filename || form.name || "Product image"
        })
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

      toast.success(`${uploadedImages.length} image(s) uploaded`);
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }

  function makePrimary(index: number) {
    setForm((prev) => {
      const copy = [...prev.images];
      const [picked] = copy.splice(index, 1);
      return {
        ...prev,
        images: picked ? [picked, ...copy] : copy
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!form.category_id) {
      toast.error("Please select a category");
      return;
    }

    if (form.images.length === 0) {
      toast.error("Please keep at least one product image");
      return;
    }

    if (form.price <= 0) {
      toast.error("Selling price must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const payload: ProductFormPayload = {
        ...form,
        slug: form.slug || slugify(form.name),
        sizes: sizesInput.split(",").map((item) => item.trim()).filter(Boolean),
        colors: colorsInput.split(",").map((item) => item.trim()).filter(Boolean)
      };

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      setLoading(false);

      if (!response.ok) {
        toast.error(result.error || "Failed to update product");
        return;
      }

      toast.success("Product updated successfully");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Something went wrong while updating the product");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-card p-5">
          <h2 className="text-xl font-semibold text-white">Basic Info</h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Product Name
              </label>
              <Input
                placeholder="Premium Oversized Shirt"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  updateField("name", name);
                  updateField("slug", slugify(name));
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Slug
              </label>
              <Input
                placeholder="premium-oversized-shirt"
                value={form.slug}
                onChange={(e) => updateField("slug", slugify(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Short Description
              </label>
              <Input
                placeholder="Short product summary for cards and previews"
                value={form.short_description}
                onChange={(e) => updateField("short_description", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Full Description
              </label>
              <Textarea
                placeholder="Write full product details, material, fit, style notes, etc."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) => updateField("category_id", e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none transition focus:border-accent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card p-5">
          <h2 className="text-xl font-semibold text-white">Pricing & Stock</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Selling Price *
              </label>
              <Input
                type="number"
                placeholder="Enter current selling price"
                value={form.price === 0 ? "" : form.price}
                onChange={(e) =>
                  updateField("price", e.target.value ? Number(e.target.value) : 0)
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Original / Compare Price
              </label>
              <Input
                type="number"
                placeholder="Optional: original MRP or old price"
                value={form.compare_at_price ?? ""}
                onChange={(e) =>
                  updateField(
                    "compare_at_price",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Discount Price
              </label>
              <Input
                type="number"
                placeholder="Optional: discounted display price"
                value={form.discount_price ?? ""}
                onChange={(e) =>
                  updateField(
                    "discount_price",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Stock Quantity
              </label>
              <Input
                type="number"
                placeholder="How many pieces are available"
                value={form.stock_quantity === 0 ? "" : form.stock_quantity}
                onChange={(e) =>
                  updateField(
                    "stock_quantity",
                    e.target.value ? Number(e.target.value) : 0
                  )
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                SKU
              </label>
              <Input
                placeholder="Optional stock keeping code"
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Sort Order
              </label>
              <Input
                type="number"
                placeholder="Optional display priority"
                value={form.sort_order === 0 ? "" : form.sort_order}
                onChange={(e) =>
                  updateField("sort_order", e.target.value ? Number(e.target.value) : 0)
                }
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value as any)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none transition focus:border-accent"
              >
                {PRODUCT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card p-5">
          <h2 className="text-xl font-semibold text-white">Variants</h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Sizes
              </label>
              <Input
                placeholder="S, M, L, XL, XXL"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Colors
              </label>
              <Input
                placeholder="Black, White, Blue"
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card p-5">
          <h2 className="text-xl font-semibold text-white">Product Images</h2>

          <div className="mt-5 space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleImageUpload(e.dataTransfer.files);
              }}
              className={`flex min-h-[180px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition ${
                isDragging
                  ? "border-accent bg-accent/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04]">
                <UploadCloud className="h-7 w-7 text-white" />
              </div>
              <p className="text-base font-semibold text-white">
                Drag & drop more product images here
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Existing images are already loaded below. Add more or reorder by making primary.
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                JPG, PNG, WEBP supported • Max 8MB each
              </p>
            </button>

            {uploadingImages ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-400">
                Uploading images...
              </div>
            ) : null}

            {form.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {form.images.map((image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={image.url}
                        alt={image.alt_text || `Product image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />

                      {index === 0 ? (
                        <div className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                          Primary
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => makePrimary(index)}
                          className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white"
                        >
                          Make Primary
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md transition hover:bg-red-500/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="px-3 py-2">
                      <p className="truncate text-xs text-zinc-400">
                        Image {index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-500">
                No images available. Upload at least one image.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-card p-5">
        <h2 className="text-xl font-semibold text-white">Tags & Toggles</h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_TAG_FIELDS.map((tag) => (
            <CheckboxCard
              key={tag.key}
              label={tag.label}
              checked={Boolean(form[tag.key as keyof ProductFormPayload])}
              onToggle={() =>
                updateField(
                  tag.key as keyof ProductFormPayload,
                  !Boolean(form[tag.key as keyof ProductFormPayload]) as any
                )
              }
            />
          ))}

          <CheckboxCard
            label="Active Product"
            checked={form.is_active}
            onToggle={() => updateField("is_active", !form.is_active)}
          />

          <CheckboxCard
            label="Allow COD"
            checked={form.allow_cod}
            onToggle={() => updateField("allow_cod", !form.allow_cod)}
          />

          <CheckboxCard
            label="Allow Online Payment"
            checked={form.allow_online_payment}
            onToggle={() =>
              updateField("allow_online_payment", !form.allow_online_payment)
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <AnimatedButton
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/products")}
          disabled={loading || uploadingImages}
        >
          Cancel
        </AnimatedButton>

        <AnimatedButton type="submit" disabled={loading || uploadingImages}>
          {loading ? "Saving Product..." : "Update Product"}
        </AnimatedButton>
      </div>
    </form>
  );
}