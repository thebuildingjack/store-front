import { products, formatPrice } from "@/lib/products";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  return (
    <main className="flex-1 bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Product image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface border border-muted/20">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product details */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-accent text-sm font-medium tracking-widest capitalize">
                {product.category}
              </p>
              <h1 className="font-heading text-4xl text-text leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= Math.round(product.rating)
                        ? "text-accent"
                        : "text-muted/30"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-text text-sm font-medium">{product.rating}</span>
              <span className="text-muted text-sm">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <p className="font-heading text-4xl text-accent">
              {formatPrice(product.price)}
            </p>

            {/* Description — placeholder for now */}
            <p className="text-muted text-sm leading-relaxed">
              Premium quality {product.name.toLowerCase()} carefully selected for
              style and durability. Fast delivery across Nigeria with easy returns
              within 7 days.
            </p>

            {/* Divider */}
            <div className="border-t border-muted/20" />

            {/* Add to cart */}
            <AddToCartButton product={product} />

            {/* Meta info */}
            <div className="flex flex-col gap-2 text-sm text-muted">
              <p>✅ In stock — ready to ship</p>
              <p>🚚 Fast delivery across Nigeria</p>
              <p>↩️ 7-day easy returns</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}