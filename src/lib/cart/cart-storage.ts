import { EMPTY_CART, type Cart } from "./types";

const STORAGE_KEY = "azadi_cart_v1";

let cachedRaw: string | null = null;
let cachedSnapshot: Cart = EMPTY_CART;

export function readCart(): Cart {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;

    if (raw === cachedRaw) return cachedSnapshot;

    const parsed = JSON.parse(raw) as Cart;
    if (!Array.isArray(parsed.items)) return EMPTY_CART;

    cachedRaw = raw;
    cachedSnapshot = parsed;
    return cachedSnapshot;
  } catch {
    return EMPTY_CART;
  }
}

export function writeCart(cart: Cart): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* storage full or unavailable */
  }
}

export function subscribeCart(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
