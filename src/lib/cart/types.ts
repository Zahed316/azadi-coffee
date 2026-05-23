export type CartItem = {
  slug: string;
  name: string;
  nameEn: string;
  priceToman: number;
  weightGram: number;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export const EMPTY_CART: Cart = { items: [] };

export type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; slug: string }
  | { type: "UPDATE_QUANTITY"; slug: string; quantity: number }
  | { type: "CLEAR" };
