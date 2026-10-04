import { createClient } from "@libsql/client/web";

const rawUrl = import.meta.env.VITE_TURSO_DATABASE_URL || "";
const sanitizedUrl = rawUrl.replace(/^libsql:\/\//, "https://").trim();
const authToken = (import.meta.env.VITE_TURSO_AUTH_TOKEN || "").trim();

// BURAYI EKLE:
console.log("--- TURSO BAĞLANTI KONTROLÜ ---");
console.log("URL:", sanitizedUrl);
console.log("Token uzunluğu:", authToken.length);
console.log("Token var mı?:", authToken ? "EVET" : "HAYIR (BOŞ!)");

export const turso = createClient({
  url: sanitizedUrl,
  authToken: authToken,
});