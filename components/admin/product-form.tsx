"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
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

type UploadedProductImage = {
  url: string;
  public_id?: string | null;
  alt_text?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<ProductFormPayload>({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    category_id: categories[0]?.id || "",
    price: 0,
    compare_at_price: null,
    discount_price: null,
    stock_quantity: 0,
    sku: "",
    sizes: [],
    colors: [],
    status: "published",
    allow_cod: true,
    allow_online_payment: true,
    sort_order: 0,
    is_active: true,
    is_featured: false,
    is_new: false,
    is_bestseller: false,
    is_hot_sale: false,
    is_trending: false,
    is_limited_stock: false,
    is_premium_pick: false,
    is_festive_drop: false,
    is_staff_pick: false,
    images: []
  });

  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const parsedSizes = useMemo(
    () =>
      sizesInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [sizesInput]
  );

  const parsedColors = useMemo(
    () =>
      colorsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [colorsInput]
  );

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
      toast.error("Please upload at least one product image");
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
        sizes: parsedSizes,
        colors: parsedColors
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to create product");
        setLoading(false);
        return;
      }

      toast.success("Product created successfully");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the product");
      setLoading(false);
      return;
    }

    setLoading(false);
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
                Drag & drop product images here
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Or click to browse and upload multiple photos
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
                No images uploaded yet.
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
          {loading ? "Saving Product..." : "Create Product"}
        </AnimatedButton>
      </div>
    </form>
  );
}