import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep react-pdf server-side only — it uses Node.js APIs (stream, canvas, zlib)
  // that cannot be bundled for the browser Edge/WASM runtime.
  serverExternalPackages: ["@react-pdf/renderer", "canvas"],

  // ─── HTTP Security Headers ───────────────────────────────────────────────
  // Applied to all routes. Intentionally omitting strict Content-Security-Policy
  // because Stripe Elements loads scripts from js.stripe.com and external CDNs —
  // a strict CSP would break payments. Add CSP only after auditing all script origins.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents your site from being embedded in iframes (clickjacking protection)
          { key: "X-Frame-Options", value: "DENY" },
          // Prevents browsers from MIME-type sniffing — serves files as declared
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Sends only the origin (not the full URL) in Referer headers to third parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disables camera, microphone, and geolocation access — not needed for this site
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
