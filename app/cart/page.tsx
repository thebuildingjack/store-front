"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="flex-1 bg-bg flex flex-col items-center justify-center gap-4 py-24">
        <span className="text-6xl">🛒</span>
        <h1 className="font-heading text-3xl text-text">Your cart is empty</h1>
        <p className="text-muted text-sm">Add some products to get started</p>
        <Link
          href="/"
          className="mt-2 bg-accent text-bg px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-bg">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-4xl text-text">Your cart</h1>
          <button
            onClick={clearCart}
            className="text-muted text-sm hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-surface border border-muted/20 rounded-2xl p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-bg shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted capitalize">{product.category}</p>
                      <h3 className="text-text text-sm font-medium leading-snug">
                        {product.name}
                      </h3>
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-muted hover:text-red-500 transition-colors text-lg leading-none shrink-0"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity */}
                    <div className="flex items-center border border-muted/30 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-1 text-text hover:bg-bg transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-text text-sm border-x border-muted/30">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-3 py-1 text-text hover:bg-bg transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="text-accent font-heading text-lg">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-surface border border-muted/20 rounded-2xl p-6 flex flex-col gap-4 h-fit">
            <h2 className="font-heading text-xl text-text">Order summary</h2>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-muted/20 pt-2 flex justify-between text-text font-medium">
                <span>Total</span>
                <span className="text-accent font-heading text-xl">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="bg-accent text-bg py-3 rounded-xl text-sm font-medium text-center hover:opacity-90 transition-opacity"
            >
              Proceed to checkout
            </Link>

            <Link
              href="/"
              className="text-muted text-sm text-center hover:text-text transition-colors"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}