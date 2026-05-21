"use client";

import { useState } from "react";

export function QuantityStepper({ initial = 1 }: { initial?: number }) {
  const [qty, setQty] = useState(initial);

  return (
    <div className="inline-flex h-11 items-center border border-ink">
      <button
        type="button"
        className="h-full w-11 border-l border-ink"
        onClick={() => setQty((value) => Math.max(1, value - 1))}
        aria-label="کم کردن تعداد"
      >
        -
      </button>
      <output className="w-12 text-center font-mono">{qty}</output>
      <button
        type="button"
        className="h-full w-11 border-r border-ink"
        onClick={() => setQty((value) => value + 1)}
        aria-label="زیاد کردن تعداد"
      >
        +
      </button>
    </div>
  );
}
