"use client";

import { useState } from "react";
import { Product } from "@/lib/products";

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    // We'll wire this to real cart state soon
    // For now just show feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <p className="text-text text-sm font-medium">Quantity</p>
        <div className="flex items-center border border-muted/30 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-text hover:bg-surface transition-colors text-lg"
          >
            −
          </button>
          <span className="px-4 py-2 text-text text-sm font-medium border-x border-muted/30">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-2 text-text hover:bg-surface transition-colors text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        className={`w-full py-4 rounded-xl font-medium text-sm transition-all ${
          added
            ? "bg-green-500 text-white"
            : "bg-accent text-bg hover:opacity-90"
        }`}
      >
        {added ? "✓ Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}