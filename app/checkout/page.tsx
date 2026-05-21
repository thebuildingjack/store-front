"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const handleOrder = async () => {
    // Client side validation
    const empty = Object.values(form).some((v) => !v.trim());
    if (empty) {
      setError("Please fill in all fields");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: form.address,
          city: form.city,
          state: form.state,
          phone: form.phone,
          total: totalPrice,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Server error. Please try again.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Clear cart state on the frontend
      clearCart();
      router.push("/account?order=placed");
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-bg">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-heading text-4xl text-text mb-8">Checkout</h1>

        {error && (
          <p className="text-red-500 text-sm bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 mb-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery form */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface border border-muted/20 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="font-heading text-xl text-text">Delivery details</h2>
              {[
                { key: "fullName", label: "Full name", placeholder: "John Doe" },
                { key: "phone", label: "Phone number", placeholder: "080xxxxxxxx" },
                { key: "address", label: "Street address", placeholder: "12 Adeola Odeku Street" },
                { key: "city", label: "City", placeholder: "Lagos" },
                { key: "state", label: "State", placeholder: "Lagos State" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-text text-sm font-medium">{label}</label>
                  <input
                    type="text"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="bg-bg border border-muted/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="bg-surface border border-muted/20 rounded-2xl p-6 flex flex-col gap-3">
              <h2 className="font-heading text-xl text-text">Payment</h2>
              <div className="flex items-center gap-3 bg-bg border border-accent/30 rounded-xl px-4 py-3">
                <span className="text-accent text-lg">💳</span>
                <div>
                  <p className="text-text text-sm font-medium">Pay on delivery</p>
                  <p className="text-muted text-xs">Cash or POS at your door</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="flex flex-col gap-4 h-fit">
            <div className="bg-surface border border-muted/20 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="font-heading text-xl text-text">Order summary</h2>
              <div className="flex flex-col gap-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text text-xs font-medium truncate">{product.name}</p>
                      <p className="text-muted text-xs">Qty: {quantity}</p>
                    </div>
                    <p className="text-text text-sm font-medium shrink-0">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-muted/20 pt-3 flex justify-between">
                <span className="text-text font-medium">Total</span>
                <span className="text-accent font-heading text-xl">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <button
                onClick={handleOrder}
                disabled={loading || items.length === 0}
                className="bg-accent text-bg py-4 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Placing order..." : "Place order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}