"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import type { CoffeeProduct } from "@/data/products";

export function ProductBuyPanel({ product }: { product: CoffeeProduct }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8 flex gap-3">
      <div className="inline-flex h-11 items-center border border-ink">
        <button
          type="button"
          className="h-full w-11 border-l border-ink"
          onClick={() => setQty((v) => Math.max(1, v - 1))}
          aria-label="کم کردن تعداد"
        >
          -
        </button>
        <output className="w-12 text-center font-mono">{qty}</output>
        <button
          type="button"
          className="h-full w-11 border-r border-ink"
          onClick={() => setQty((v) => v + 1)}
          aria-label="زیاد کردن تعداد"
        >
          +
        </button>
      </div>
      <button
        className="min-h-11 flex-1 border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink"
        onClick={() => {
          addItem({
            slug: product.slug,
            name: product.name,
            nameEn: product.nameEn,
            priceToman: product.priceToman,
            weightGram: product.weightGram,
            quantity: qty,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
      >
        {added ? "✓ افزوده شد" : "افزودن به سبد"}
      </button>
    </div>
  );
}

export function ProductBuyPanelEn({ product }: { product: CoffeeProduct }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8 flex gap-3">
      <div className="inline-flex h-11 items-center border border-ink">
        <button
          type="button"
          className="h-full w-11 border-l border-ink"
          onClick={() => setQty((v) => Math.max(1, v - 1))}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <output className="w-12 text-center font-mono">{qty}</output>
        <button
          type="button"
          className="h-full w-11 border-r border-ink"
          onClick={() => setQty((v) => v + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        className="min-h-11 flex-1 border border-ink bg-ink px-5 font-bold text-white transition hover:bg-paper hover:text-ink"
        onClick={() => {
          addItem({
            slug: product.slug,
            name: product.name,
            nameEn: product.nameEn,
            priceToman: product.priceToman,
            weightGram: product.weightGram,
            quantity: qty,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
      >
        {added ? "✓ Added" : "Add to cart"}
      </button>
    </div>
  );
}
