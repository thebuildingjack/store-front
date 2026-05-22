import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/Prisma";

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

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { address, city, state, phone, items, total } = await req.json();

  if (!address || !city || !state || !phone || !items?.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Fetch all products in the order from the database in one query
  // This replaces the old hardcoded products.find()
  const productIds = items.map((i: { productId: string }) => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

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
          // Look up the price from the database result
          const product = dbProducts.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product?.price || 0,
          };
        }),
      },
    },
    include: { items: true },
  });

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return NextResponse.json({ order }, { status: 201 });
}