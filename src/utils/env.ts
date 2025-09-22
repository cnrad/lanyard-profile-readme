export const isProduction = process.env.NODE_ENV === "production";
export const LANYARD_API_URL = process.env.LANYARD_API_URL?.replace(/\/$/, "") || "https://api.lanyard.rest/v1";
export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "https://lanyard.cnrad.dev";
export const LANYARD_API_KEY = process.env.LANYARD_API_KEY ?? null;

console.log("LANYARD_API_URL:", LANYARD_API_URL, "\n");
console.log("NEXT_PUBLIC_BASE_URL:", NEXT_PUBLIC_BASE_URL, "\n");
if (isProduction) console.log("isProduction:", String(isProduction), "\n");

