import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }: { request: Request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log("Webhook received:", topic);
  console.log("Order ID:", payload.id);

  try {
    await prisma.order.upsert({
      where: { id: String(payload.id) },
      update: {
        orderNumber: payload.order_number ?? null,
        totalPrice: payload.total_price
          ? parseFloat(payload.total_price)
          : null,
        currency: payload.currency ?? null,
        email: payload.email ?? null,
      },
      create: {
        id: String(payload.id),
        shop,
        orderNumber: payload.order_number ?? null,
        totalPrice: payload.total_price
          ? parseFloat(payload.total_price)
          : null,
        currency: payload.currency ?? null,
        email: payload.email ?? null,
      },
    });

    console.log("✅ Order saved to DB");
  } catch (error) {
    console.error("❌ DB Error:", error);
  }

  return new Response();
};

// import { authenticate } from "../shopify.server";

// export const action = async ({ request }: { request: Request }) => {
//   const { topic, shop, payload } = await authenticate.webhook(request);

//   console.log("\n --------- \n");
//   console.log("Webhook received:", topic);
//   console.log("Shop:", shop);
//   console.log("Order ID:", payload.id);
//   console.log("Total price:", payload.total_price);
//   console.log("Full payload:", payload);
//   console.log("\n --------- \n");

//   return new Response();
// };
