export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "clothes" | "appliances" | "gadgets";
  rating: number;
  reviews: number;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White Sneakers",
    price: 45000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    category: "clothes",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: "2",
    name: "Slim Fit Chinos",
    price: 18500,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
    category: "clothes",
    rating: 4.2,
    reviews: 94,
  },
  {
    id: "3",
    name: "Oversized Hoodie",
    price: 22000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
    category: "clothes",
    rating: 4.7,
    reviews: 203,
  },
  {
    id: "4",
    name: "Samsung 55\" Smart TV",
    price: 320000,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=80",
    category: "appliances",
    rating: 4.6,
    reviews: 87,
  },
  {
    id: "5",
    name: "Standing Blender",
    price: 35000,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
    category: "appliances",
    rating: 4.3,
    reviews: 56,
  },
  {
    id: "6",
    name: "Air Fryer 5L",
    price: 48000,
    image: "https://images.unsplash.com/photo-1648170901813-f5f3dd5af2b2?w=400&q=80",
    category: "appliances",
    rating: 4.8,
    reviews: 312,
  },
  {
    id: "7",
    name: "iPhone 15 Pro",
    price: 850000,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    category: "gadgets",
    rating: 4.9,
    reviews: 541,
  },
  {
    id: "8",
    name: "Sony WH-1000XM5 Headphones",
    price: 185000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    category: "gadgets",
    rating: 4.8,
    reviews: 429,
  },
  {
    id: "9",
    name: "iPad Air M2",
    price: 620000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    category: "gadgets",
    rating: 4.7,
    reviews: 198,
  },
];

// Helper to format price in Naira
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}