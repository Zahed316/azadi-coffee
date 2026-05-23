import type { Cart, CartAction, CartItem } from "./types";

export function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((item) => item.slug === action.item.slug);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.slug === action.item.slug
              ? { ...item, quantity: item.quantity + action.item.quantity }
              : item,
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }

    case "REMOVE_ITEM": {
      return {
        items: state.items.filter((item) => item.slug !== action.slug),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((item) => item.slug !== action.slug),
        };
      }
      return {
        items: state.items.map((item) =>
          item.slug === action.slug ? { ...item, quantity: action.quantity } : item,
        ),
      };
    }

    case "CLEAR": {
      return { items: [] };
    }

    default:
      return state;
  }
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceToman * item.quantity, 0);
}
