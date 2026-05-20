/* "use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/products";

// Shape of a cart item — a product plus how many the user wants
export type CartItem = {
  product: Product;
  quantity: number;
};

// Shape of everything the cart context exposes
type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

// Create the context with a default value of null
const CartContext = createContext<CartContextType | null>(null);

// Provider wraps the app and holds the actual state
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Load cart from localStorage on first render
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage every time items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number) => {
    setItems((prev) => {
      // If item already in cart, increase quantity
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      // Otherwise add new item
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  // Derived values — calculated from items automatically
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook — any component calls useCart() to access the cart
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
} */


  "use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/products";
import { products as allProducts } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  syncing: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // On mount — check if user is logged in and load the right cart
  useEffect(() => {
    const init = async () => {
      setSyncing(true);

      // Check if user is logged in by calling /api/auth/me
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.user) {
        // Logged in → fetch cart from database
        setIsLoggedIn(true);
        await fetchServerCart();
      } else {
        // Not logged in → load from localStorage
        setIsLoggedIn(false);
        loadLocalCart();
      }

      setSyncing(false);
    };

    init();
  }, []);

  // Load cart from localStorage
  const loadLocalCart = () => {
    try {
      const stored = localStorage.getItem("cart");
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }
  };

  // Save cart to localStorage whenever items change (only for guests)
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoggedIn]);

  // Fetch cart from the server and map productIds back to full product objects
  const fetchServerCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();

      // The server only stores productId and quantity
      // We need to match those back to the full product objects from our list
      const mapped: CartItem[] = data.items
        .map((item: { productId: string; quantity: number }) => {
          const product = allProducts.find((p) => p.id === item.productId);
          if (!product) return null;
          return { product, quantity: item.quantity };
        })
        .filter(Boolean);

      setItems(mapped);
    } catch {
      setItems([]);
    }
  };

  const addItem = async (product: Product, quantity: number) => {
    if (isLoggedIn) {
      // Save to database
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      await fetchServerCart();
    } else {
      // Save to localStorage
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { product, quantity }];
      });
    }
  };

  const removeItem = async (productId: string) => {
    if (isLoggedIn) {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      await fetchServerCart();
    } else {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    if (isLoggedIn) {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      await fetchServerCart();
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      // Delete all items one by one from the server
      await Promise.all(
        items.map((i) =>
          fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: i.product.id }),
          })
        )
      );
    }
    setItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        syncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}