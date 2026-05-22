"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, Suspense } from "react";
import { formatPrice } from "@/lib/products";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  total: number;
  status: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
  items: OrderItem[];
};

// Maps status to a color
const statusColor: Record<string, string> = {
  PENDING: "text-yellow-500 bg-yellow-500/10",
  CONFIRMED: "text-blue-500 bg-blue-500/10",
  SHIPPED: "text-purple-500 bg-purple-500/10",
  DELIVERED: "text-green-500 bg-green-500/10",
  CANCELLED: "text-red-500 bg-red-500/10",
};

function AccountContent() {
  const searchParams = useSearchParams();
  const orderPlaced = searchParams.get("order") === "placed";
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (!cancelled) setOrders(data.orders || []);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <main className="flex-1 bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl text-text">My account</h1>
            {user && <p className="text-muted text-sm mt-1">Welcome back, {user.name}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-muted hover:text-red-500 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Order placed banner */}
        {orderPlaced && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-green-500 font-medium text-sm">Order placed successfully!</p>
              <p className="text-muted text-xs">We&#39ll deliver to your address soon.</p>
            </div>
          </div>
        )}

        {/* Order history */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl text-text">My orders</h2>

          {loadingOrders ? (
            <p className="text-muted text-sm">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="bg-surface border border-muted/20 rounded-2xl p-8 flex flex-col items-center gap-3">
              <span className="text-4xl">📦</span>
              <p className="text-text font-medium">No orders yet</p>
              <p className="text-muted text-sm">Your order history will appear here</p>
              <Link
                href="/"
                className="mt-2 bg-accent text-bg px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface border border-muted/20 rounded-2xl p-5 flex flex-col gap-4"
              >
                {/* Order header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-text text-sm font-medium">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-muted text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColor[order.status]}`}
                  >
                    {order.status.toLowerCase()}
                  </span>
                </div>

                {/* Order items */}
                <div className="flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-text text-xs font-medium truncate">
                          Product ID: {item.productId.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-muted text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-text text-xs font-medium shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order footer */}
                <div className="border-t border-muted/20 pt-3 flex items-center justify-between">
                  <p className="text-muted text-xs">
                    {order.address}, {order.city}, {order.state}
                  </p>
                  <p className="text-accent font-heading text-lg">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountContent />
    </Suspense>
  );
}