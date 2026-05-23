const DEFAULT_REVALIDATE_SECONDS = 60;
const DEFAULT_TIMEOUT_MS = 5000;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function getWordPressApiUrl() {
  return process.env.WORDPRESS_API_URL || (process.env.WORDPRESS_BASE_URL ? `${process.env.WORDPRESS_BASE_URL.replace(/\/+$/, "")}/wp-json` : "");
}

export function hasWordPressApi() {
  return Boolean(getWordPressApiUrl());
}

export function buildApiUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const baseUrl = getWordPressApiUrl();
  if (!baseUrl) {
    throw new ApiRequestError("WORDPRESS_API_URL or WORDPRESS_BASE_URL is not configured.");
  }

  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & {
    params?: Record<string, string | number | boolean | undefined>;
    revalidate?: number;
    authenticated?: boolean;
    timeoutMs?: number;
  } = {},
): Promise<T> {
  const { params, revalidate = DEFAULT_REVALIDATE_SECONDS, authenticated, headers, timeoutMs = DEFAULT_TIMEOUT_MS, ...requestInit } = init;
  const url = buildApiUrl(path, params);
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (authenticated) {
    const username = process.env.WORDPRESS_APPLICATION_USERNAME;
    const password = process.env.WORDPRESS_APPLICATION_PASSWORD;
    if (!username || !password) {
      throw new ApiRequestError("WordPress application credentials are not configured.");
    }
    requestHeaders.set("Authorization", `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...requestInit,
      headers: requestHeaders,
      next: { revalidate },
      signal: requestInit.signal || controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ApiRequestError(`API request failed: ${url.pathname}`, response.status);
  }

  return response.json() as Promise<T>;
}

export async function safeApiFetch<T>(path: string, fallback: T, init?: Parameters<typeof apiFetch<T>>[1]): Promise<T> {
  if (!hasWordPressApi()) {
    return fallback;
  }

  try {
    return await apiFetch<T>(path, init);
  } catch {
    return fallback;
  }
}
