import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";

// GET /api/products → fetch all products, optionally filtered by category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const products = await prisma.product.findMany({
      where: {
        // Only apply filters if they exist
        ...(category && { category }),
        ...(search && {
          OR: [
            // Search by name or category, case insensitive
            { name: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
          ],
        }),
        inStock: true, // only show in-stock products
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}