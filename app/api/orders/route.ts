import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type IncomingCartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `B2B-${y}${m}${d}-${random}`;
}

function sanitizePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customer_name = String(body?.customer_name || "").trim();
    const customer_phone = sanitizePhone(String(body?.customer_phone || ""));
    const customer_email = String(body?.customer_email || "").trim() || null;
    const address_line = String(body?.address_line || "").trim();
    const city = String(body?.city || "").trim();
    const state = String(body?.state || "").trim();
    const pincode = String(body?.pincode || "").trim();
    const payment_method = String(body?.payment_method || "cod");
    const customer_note = String(body?.customer_note || "").trim() || null;
    const items = Array.isArray(body?.items) ? (body.items as IncomingCartItem[]) : [];

    if (!customer_name || !customer_phone || !address_line || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "Please fill all required customer details." },
        { status: 400 }
      );
    }

    if (customer_phone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    const productIds = items.map((item) => item.productId);

    const { data: dbProducts, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, slug, price, discount_price, stock_quantity, is_active, status")
      .in("id", productIds);

    if (productsError) {
      return NextResponse.json(
        { error: productsError.message || "Failed to validate products." },
        { status: 500 }
      );
    }

    const productMap = new Map(
      (dbProducts || []).map((p) => [String(p.id), p])
    );

    let subtotal = 0;

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }

      if (!dbProduct.is_active || dbProduct.status !== "published") {
        return NextResponse.json(
          { error: `Product unavailable: ${dbProduct.name}` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Number(item.quantity || 1));

      if ((dbProduct.stock_quantity || 0) < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${dbProduct.name}` },
          { status: 400 }
        );
      }

      const effectivePrice =
        dbProduct.discount_price !== null && dbProduct.discount_price !== undefined
          ? Number(dbProduct.discount_price)
          : Number(dbProduct.price || 0);

      subtotal += effectivePrice * qty;
    }

    const shipping_charge = 0;
    const discount_amount = 0;
    const total_amount = subtotal + shipping_charge - discount_amount;
    const order_number = generateOrderNumber();

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        address_line,
        city,
        state,
        pincode,
        payment_method,
        payment_status: payment_method === "cod" ? "pending" : "pending",
        order_status: "new",
        subtotal,
        shipping_charge,
        discount_amount,
        total_amount,
        customer_note,
        source: "website",
        whatsapp_sent: false
      })
      .select("id, order_number, total_amount")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message || "Failed to create order." },
        { status: 500 }
      );
    }

    const orderItems = items.map((item) => {
      const dbProduct = productMap.get(item.productId)!;
      const qty = Math.max(1, Number(item.quantity || 1));
      const effectivePrice =
        dbProduct.discount_price !== null && dbProduct.discount_price !== undefined
          ? Number(dbProduct.discount_price)
          : Number(dbProduct.price || 0);

      return {
        order_id: order.id,
        product_id: dbProduct.id,
        product_name_snapshot: dbProduct.name,
        product_slug_snapshot: dbProduct.slug,
        image_snapshot: item.image || null,
        price_snapshot: effectivePrice,
        quantity: qty,
        size: item.size || null,
        color: item.color || null,
        line_total: effectivePrice * qty
      };
    });

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);

      return NextResponse.json(
        { error: itemsError.message || "Failed to save order items." },
        { status: 500 }
      );
    }

    // Deduct stock
    for (const item of items) {
      const dbProduct = productMap.get(item.productId)!;
      const qty = Math.max(1, Number(item.quantity || 1));

      await supabaseAdmin
        .from("products")
        .update({
          stock_quantity: Math.max(0, Number(dbProduct.stock_quantity || 0) - qty)
        })
        .eq("id", dbProduct.id);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount || total_amount)
    });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json(
      { error: "Something went wrong while placing the order." },
      { status: 500 }
    );
  }
}