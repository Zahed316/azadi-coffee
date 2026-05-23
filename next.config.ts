import type { NextConfig } from "next";

const wordpressHost = process.env.WORDPRESS_BASE_URL
  ? new URL(process.env.WORDPRESS_BASE_URL).hostname
  : undefined;

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const publicSiteHost = publicSiteUrl ? new URL(publicSiteUrl).hostname : undefined;

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (wordpressHost) {
  remotePatterns.push({ protocol: "https", hostname: wordpressHost, pathname: "/**" });
}

if (publicSiteHost && publicSiteHost !== wordpressHost) {
  remotePatterns.push({ protocol: "https", hostname: publicSiteHost, pathname: "/**" });
}

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*/",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "https",
          },
        ],
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
