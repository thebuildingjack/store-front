import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/Prisma";
import { products } from "@/lib/products";

function getUserId(req: NextRequest): string | null {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET /api/orders → fetch all orders for the logged in user
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" }, // most recent first
  });

  return NextResponse.json({ orders });
}

// POST /api/orders → place a new order
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { address, city, state, phone, items, total } = await req.json();

  // Validate all required fields are present
  if (!address || !city || !state || !phone || !items?.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Create the order with all its items in one query
  // Prisma lets you create nested records in a single call
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      address,
      city,
      state,
      phone,
      items: {
        create: items.map((item: { productId: string; quantity: number }) => {
          // Look up the current price from our products list
          const product = products.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product?.price || 0, // snapshot the price at time of order
          };
        }),
      },
    },
    include: { items: true },
  });

  // Clear the user's cart after order is placed
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return NextResponse.json({ order }, { status: 201 });
}