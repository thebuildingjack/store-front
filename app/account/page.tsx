"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function AccountContent() {
  const searchParams = useSearchParams();
  const orderPlaced = searchParams.get("order") === "placed";
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <main className="flex-1 bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-4xl text-text">My account</h1>
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
              <p className="text-muted text-xs">We'll deliver to your address soon.</p>
            </div>
          </div>
        )}

        {/* Account sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { emoji: "📦", title: "My orders", desc: "Track and manage your orders", href: "#" },
            { emoji: "📍", title: "Saved addresses", desc: "Manage delivery addresses", href: "#" },
            { emoji: "💳", title: "Payment methods", desc: "Manage your payment options", href: "#" },
            { emoji: "⚙️", title: "Settings", desc: "Update your profile and password", href: "#" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-surface border border-muted/20 rounded-2xl p-5 flex gap-4 hover:border-accent transition-colors group"
            >
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <h3 className="text-text font-medium text-sm group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted text-xs mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
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