import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    name,
    slug,
    short_description,
    description,
    category_id,
    price,
    compare_at_price,
    discount_price,
    stock_quantity,
    sku,
    sizes,
    colors,
    status,
    allow_cod,
    allow_online_payment,
    sort_order,
    is_active,
    is_featured,
    is_new,
    is_bestseller,
    is_hot_sale,
    is_trending,
    is_limited_stock,
    is_premium_pick,
    is_festive_drop,
    is_staff_pick,
    images
  } = body;

  if (!name || !slug || !category_id) {
    return NextResponse.json(
      { error: "Name, slug, and category are required." },
      { status: 400 }
    );
  }

  if (!Array.isArray(images) || images.length === 0) {
    return NextResponse.json(
      { error: "At least one uploaded image is required." },
      { status: 400 }
    );
  }

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .insert({
      name,
      slug,
      short_description,
      description,
      category_id,
      price,
      compare_at_price,
      discount_price,
      stock_quantity,
      sku,
      sizes,
      colors,
      status,
      allow_cod,
      allow_online_payment,
      sort_order,
      is_active,
      is_featured,
      is_new,
      is_bestseller,
      is_hot_sale,
      is_trending,
      is_limited_stock,
      is_premium_pick,
      is_festive_drop,
      is_staff_pick,
      created_by: auth.user.id,
      updated_by: auth.user.id
    })
    .select("id")
    .single();

  if (productError || !product) {
    return NextResponse.json(
      { error: productError?.message || "Failed to create product" },
      { status: 500 }
    );
  }

 type UploadedImageInput = {
  url: string;
  public_id?: string | null;
  alt_text?: string;
};

const imageRows = (images as UploadedImageInput[]).map((img, index) => ({
  product_id: product.id,
  image_url: img.url,
  cloudinary_public_id: img.public_id || null,
  alt_text: img.alt_text || name,
  is_primary: index === 0,
  sort_order: index
}));

  const { error: imageError } = await supabaseAdmin
    .from("product_images")
    .insert(imageRows);

  if (imageError) {
    return NextResponse.json(
      { error: imageError.message || "Product created, but image save failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, productId: product.id });
}