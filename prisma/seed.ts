import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding products...");

  // Delete existing products first to avoid duplicates on re-run
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Classic White Sneakers",
        description: "Premium white sneakers built for everyday comfort and style. Features a cushioned sole and breathable upper material.",
        price: 45000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        category: "clothes",
        rating: 4.5,
        reviews: 128,
      },
      {
        name: "Slim Fit Chinos",
        description: "Modern slim fit chinos in a versatile neutral tone. Perfect for casual and semi-formal occasions.",
        price: 18500,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
        category: "clothes",
        rating: 4.2,
        reviews: 94,
      },
      {
        name: "Oversized Hoodie",
        description: "Cozy oversized hoodie made from premium fleece. Available in multiple colors.",
        price: 22000,
        image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
        category: "clothes",
        rating: 4.7,
        reviews: 203,
      },
      {
        name: "Samsung 55\" Smart TV",
        description: "55-inch 4K Smart TV with built-in streaming apps, voice control, and crystal clear display.",
        price: 320000,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=80",
        category: "appliances",
        rating: 4.6,
        reviews: 87,
      },
      {
        name: "Standing Blender",
        description: "Powerful 1000W standing blender with multiple speed settings. Perfect for smoothies and food prep.",
        price: 35000,
        image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
        category: "appliances",
        rating: 4.3,
        reviews: 56,
      },
      {
        name: "Air Fryer 5L",
        description: "5-litre digital air fryer with 8 preset cooking modes. Cook healthier meals with little to no oil.",
        price: 48000,
        image: "https://images.unsplash.com/photo-1648170901813-f5f3dd5af2b2?w=400&q=80",
        category: "appliances",
        rating: 4.8,
        reviews: 312,
      },
      {
        name: "iPhone 15 Pro",
        description: "Apple iPhone 15 Pro with A17 Pro chip, titanium design, and the most advanced camera system ever.",
        price: 850000,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
        category: "gadgets",
        rating: 4.9,
        reviews: 541,
      },
      {
        name: "Sony WH-1000XM5 Headphones",
        description: "Industry-leading noise cancelling headphones with 30-hour battery life and crystal clear audio.",
        price: 185000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        category: "gadgets",
        rating: 4.8,
        reviews: 429,
      },
      {
        name: "iPad Air M2",
        description: "Powerful iPad Air with M2 chip, stunning Liquid Retina display, and all-day battery life.",
        price: 620000,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
        category: "gadgets",
        rating: 4.7,
        reviews: 198,
      },
    ],
  });

  console.log("✅ Seeded 9 products successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });