import { products, formatPrice } from "@/lib/products";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.toLowerCase().trim() || "";

  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    : [];

  return (
    <main className="flex-1 bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl text-text">
            {query ? `Results for "${q}"` : "Search"}
          </h1>
          <p className="text-muted text-sm mt-1">
            {query
              ? results.length > 0
                ? `${results.length} products found`
                : "No products found"
              : "Enter a search term above"}
          </p>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-surface border border-muted/20 rounded-2xl overflow-hidden hover:border-accent transition-colors group"
              >
                <div className="aspect-square overflow-hidden bg-bg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <p className="text-xs text-muted capitalize">{product.category}</p>
                  <h3 className="text-text text-sm font-medium line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-accent text-xs">★</span>
                    <span className="text-text text-xs font-medium">{product.rating}</span>
                    <span className="text-muted text-xs">({product.reviews})</span>
                  </div>
                  <p className="text-accent font-heading text-lg mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-6xl">🔍</span>
            <p className="text-text font-heading text-2xl">No results found</p>
            <p className="text-muted text-sm">
              Try searching for something else
            </p>
            <Link
              href="/"
              className="mt-2 bg-accent text-bg px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Back to home
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}