import { formatPrice, Product } from "@/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const validCategories = ["clothes", "appliances", "gadgets"];

async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${category}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!validCategories.includes(slug)) notFound();

  const products = await getProductsByCategory(slug);

  return (
    <main className="flex-1 bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-muted text-sm mb-1">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>{" "}
            / <span className="capitalize">{slug}</span>
          </p>
          <h1 className="font-heading text-4xl text-text capitalize">{slug}</h1>
          <p className="text-muted text-sm mt-1">{products.length} products</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-surface border border-muted/20 rounded-2xl overflow-hidden hover:border-accent transition-colors group"
            >
              <div className="relative aspect-square overflow-hidden bg-bg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 flex flex-col gap-1">
                <p className="text-xs text-muted capitalize">
                  {product.category}
                </p>
                <h3 className="text-text text-sm font-medium line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-accent text-xs">★</span>
                  <span className="text-text text-xs font-medium">
                    {product.rating}
                  </span>
                  <span className="text-muted text-xs">
                    ({product.reviews})
                  </span>
                </div>
                <p className="text-accent font-heading text-lg mt-1">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}