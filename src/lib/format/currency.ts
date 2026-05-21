const tomanFormatter = new Intl.NumberFormat("fa-IR");

export function formatToman(amount: number) {
  return `${tomanFormatter.format(amount)} تومان`;
}

export function formatRial(amountInToman: number) {
  return `${tomanFormatter.format(amountInToman * 10)} ریال`;
}
