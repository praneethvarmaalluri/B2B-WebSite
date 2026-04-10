import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const { orderNumber, customerName, customerPhone, totalAmount, paymentMethod, items } =
      await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL");

    if (!RESEND_API_KEY || !OWNER_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Missing function secrets" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const itemsHtml = (items || [])
      .map(
        (item: any, index: number) => `
          <tr>
            <td style="padding:8px;border:1px solid #eee;">${index + 1}</td>
            <td style="padding:8px;border:1px solid #eee;">${item.name}</td>
            <td style="padding:8px;border:1px solid #eee;">${item.quantity}</td>
            <td style="padding:8px;border:1px solid #eee;">₹${item.price}</td>
          </tr>
        `
      )
      .join("");

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2>New Website Order Received</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total:</strong> ₹${totalAmount}</p>

        <h3>Items</h3>
        <table style="border-collapse:collapse;width:100%;">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #eee;">#</th>
              <th style="padding:8px;border:1px solid #eee;">Product</th>
              <th style="padding:8px;border:1px solid #eee;">Qty</th>
              <th style="padding:8px;border:1px solid #eee;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Brand 2 Brands <onboarding@resend.dev>",
        to: [OWNER_EMAIL],
        subject: `New Order: ${orderNumber}`,
        html: emailHtml
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(JSON.stringify(resendData), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, resendData }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});