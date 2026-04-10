import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

type UploadedImageInput = {
  url: string;
  public_id?: string | null;
  alt_text?: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();

  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = params.id;
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
      { error: "At least one product image is required." },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("products")
    .update({
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
      updated_by: auth.user.id
    })
    .eq("id", productId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message || "Failed to update product" },
      { status: 500 }
    );
  }

  // Replace all product images with latest submitted list
  const { error: deleteImagesError } = await supabaseAdmin
    .from("product_images")
    .delete()
    .eq("product_id", productId);

  if (deleteImagesError) {
    return NextResponse.json(
      { error: deleteImagesError.message || "Failed to refresh product images" },
      { status: 500 }
    );
  }

  const imageRows = (images as UploadedImageInput[]).map((img, index) => ({
    product_id: productId,
    image_url: img.url,
    cloudinary_public_id: img.public_id || null,
    alt_text: img.alt_text || name,
    is_primary: index === 0,
    sort_order: index
  }));

  const { error: imageInsertError } = await supabaseAdmin
    .from("product_images")
    .insert(imageRows);

  if (imageInsertError) {
    return NextResponse.json(
      { error: imageInsertError.message || "Product updated, but image save failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}