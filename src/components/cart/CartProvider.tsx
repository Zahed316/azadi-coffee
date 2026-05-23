"use client";

import { type ReactNode } from "react";
import { CartContextProvider } from "@/lib/cart/cart-context";

export function CartProvider({ children }: { children: ReactNode }) {
  return <CartContextProvider>{children}</CartContextProvider>;
}
