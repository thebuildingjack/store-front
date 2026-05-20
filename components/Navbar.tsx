"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();
  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-muted/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="shrink-0">
          <span className="font-heading text-2xl text-accent tracking-tight">
            Bazar
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center bg-bg border border-muted/30 rounded-xl overflow-hidden focus-within:border-accent transition-colors"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-text outline-none placeholder:text-muted"
          />
          <button
          title="submit"
            type="submit"
            className="px-4 py-2.5 text-muted hover:text-accent transition-colors"
          >
            <SearchIcon />
          </button>
        </form>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeSwitcher />

          <Link
            href="/account"
            className="flex items-center gap-2 p-2 rounded-xl text-muted hover:text-text hover:bg-bg transition-colors"
          >
            <AccountIcon />
            {user && (
              <span className="text-text text-sm font-medium hidden sm:block">
                {user.name.split(" ")[0]}
              </span>
            )}
          </Link>

          {/* <Link
            href="/cart"
            className="relative p-2 rounded-xl text-muted hover:text-text hover:bg-bg transition-colors"
          >
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-bg text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link> */}
          <Link
            href="/cart"
            className="relative p-2 rounded-xl text-muted hover:text-text hover:bg-bg transition-colors"
          >
            <CartIcon />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-bg text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 pb-2 flex items-center gap-6 overflow-x-auto">
        {["All", "Clothes", "Appliances", "Gadgets"].map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/" : `/category/${cat.toLowerCase()}`}
            className="shrink-0 text-sm text-muted hover:text-accent transition-colors pb-1 border-b-2 border-transparent hover:border-accent"
          >
            {cat}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}