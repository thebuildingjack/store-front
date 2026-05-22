import Link from "next/link";
import { formatPrice, Product } from "@/lib/products";
import Image from "next/image";

const categories = [
  {
    name: "Clothes",
    slug: "clothes",
    emoji: "👗",
    description: "Fashion for every style",
  },
  {
    name: "Appliances",
    slug: "appliances",
    emoji: "🏠",
    description: "Power your home",
  },
  {
    name: "Gadgets",
    slug: "gadgets",
    emoji: "📱",
    description: "Latest tech gear",
  },
];

async function getProducts(): Promise<Product[]> {
  try {
    // Use absolute URL for server-side fetch
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
      { cache: "no-store" } // always fetch fresh data
    );
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="flex-1 bg-bg">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-4">
        <p className="text-accent text-sm font-medium tracking-widest uppercase">
          New arrivals
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text leading-tight max-w-2xl">
          Everything you need, delivered.
        </h1>
        <p className="text-muted text-lg max-w-xl">
          Shop clothes, appliances, and gadgets — all in one place. Fast
          delivery across Nigeria.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/category/gadgets"
            className="bg-accent text-bg px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Shop now
          </Link>
          <Link
            href="/category/clothes"
            className="border border-muted/30 text-text px-6 py-3 rounded-xl text-sm font-medium hover:border-accent transition-colors"
          >
            View categories
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="font-heading text-2xl text-text mb-6">
          Shop by category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="bg-surface border border-muted/20 rounded-2xl p-6 flex flex-col gap-2 hover:border-accent transition-colors group"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <h3 className="font-heading text-xl text-text group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
              <p className="text-muted text-sm">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl text-text">
            Featured products
          </h2>
          <Link href="/" className="text-accent text-sm hover:underline">
            View all
          </Link>
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
      </section>
    </main>
  );
}