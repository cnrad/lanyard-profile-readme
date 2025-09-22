export const isProduction = process.env.NODE_ENV === "production";
export const LANYARD_API_URL = process.env.LANYARD_API_URL?.replace(/\/$/, "") || "https://api.lanyard.rest/v1";
export const NEXT_PUBLIC_BASE_URL = process.env.BASE_URL?.replace(/\/$/, "") || "https://lanyard.cnrad.dev";