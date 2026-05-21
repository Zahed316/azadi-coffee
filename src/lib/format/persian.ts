export function inventoryLabel(status: "available" | "low" | "sold-out") {
  if (status === "available") return "آماده ارسال";
  if (status === "low") return "موجودی محدود";
  return "ناموجود";
}

export function latin(text: string) {
  return /[A-Za-z]/.test(text);
}
