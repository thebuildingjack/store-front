import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/Prisma";

// Helper to get the userId from the token cookie
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

// GET /api/cart → fetch the current user's cart
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ items: [] }, { status: 401 });
  }

  // Find the user's cart and include all its items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  // If no cart yet, return empty items
  return NextResponse.json({ items: cart?.items || [] });
}

// POST /api/cart → add or update an item in the cart
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  // upsert means "update if exists, create if not"
  // This finds or creates the user's cart first
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },  // create a new cart for this user
    update: {},          // if cart exists, don't change anything about the cart itself
  });

  // Then upsert the cart item
  const item = await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } }, // if item exists, add to quantity
  });

  return NextResponse.json({ item }, { status: 201 });
}

// DELETE /api/cart → remove an item from the cart
export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  await prisma.cartItem.delete({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
  });

  return NextResponse.json({ message: "Item removed" });
}

// PATCH /api/cart → update the quantity of an item
export async function PATCH(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  const item = await prisma.cartItem.update({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
    data: { quantity },
  });

  return NextResponse.json({ item });
}