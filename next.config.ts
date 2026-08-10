import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep react-pdf server-side only — it uses Node.js APIs (stream, canvas, zlib)
  // that cannot be bundled for the browser Edge/WASM runtime.
  serverExternalPackages: ["@react-pdf/renderer", "canvas"],
};

export default nextConfig;
