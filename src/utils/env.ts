export const isProduction = process.env.NODE_ENV === "production";
export const LANYARD_API_URL = process.env.LANYARD_API_URL?.replace(/\/$/, "") || "https://api.lanyard.rest/v1";