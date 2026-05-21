export const iranianGateways = [
  {
    id: "zarinpal",
    name: "زرین پال",
    strategy: "WooCommerce gateway plugin first; Next.js redirects to hosted callback.",
  },
  {
    id: "behpardakht",
    name: "به پرداخت ملت",
    strategy: "Use a maintained WooCommerce plugin because settlement and verify flows are bank-specific.",
  },
  {
    id: "idpay",
    name: "آی دی پی",
    strategy: "Acceptable as a secondary gateway after plugin maintenance and callback security review.",
  },
] as const;
