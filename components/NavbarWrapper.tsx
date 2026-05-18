"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const hideNavOn = ["/login", "/register"];

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (hideNavOn.includes(pathname)) return null;

  return <Navbar />;
}