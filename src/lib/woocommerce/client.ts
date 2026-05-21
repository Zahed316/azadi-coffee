export type WooProduct = {
  id: number;
  slug: string;
  name: string;
  price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
};

const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
const key = process.env.WC_CONSUMER_KEY;
const secret = process.env.WC_CONSUMER_SECRET;

export async function wooFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!wpUrl || !key || !secret) {
    throw new Error("WooCommerce env vars are missing.");
  }

  const url = new URL(`/wp-json/wc/v3/${path.replace(/^\/+/, "")}`, wpUrl);
  url.searchParams.set("consumer_key", key);
  url.searchParams.set("consumer_secret", secret);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`WooCommerce request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function listWooProducts() {
  return wooFetch<WooProduct[]>("products?per_page=20");
}
