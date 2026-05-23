"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useSyncExternalStore, type ReactNode } from "react";
import { cartReducer, getCartCount, getCartTotal } from "./cart-reducer";
import { readCart, subscribeCart, writeCart } from "./cart-storage";
import type { Cart, CartItem } from "./types";
import { EMPTY_CART } from "./types";

export type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function calculateSnapshot(cart: Cart) {
  return {
    items: cart.items,
    count: getCartCount(cart.items),
    total: getCartTotal(cart.items),
  };
}

export function CartContextProvider({ children, initialCart }: { children: ReactNode; initialCart?: Cart }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart ?? EMPTY_CART);

  const storageSnapshot = useSyncExternalStore(
    subscribeCart,
    () => readCart(),
    () => initialCart ?? EMPTY_CART,
  );

  useEffect(() => {
    if (storageSnapshot.items.length > 0 && cart.items.length === 0) {
      for (const item of storageSnapshot.items) {
        dispatch({ type: "ADD_ITEM", item });
      }
    }
  }, [storageSnapshot, cart.items.length]);

  useEffect(() => {
    writeCart(cart);
  }, [cart]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", item });
  }, []);

  const removeItem = useCallback((slug: string) => {
    dispatch({ type: "REMOVE_ITEM", slug });
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", slug, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const value = useMemo(
    () => ({ ...calculateSnapshot(cart), addItem, removeItem, updateQuantity, clearCart }),
    [cart, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
}
