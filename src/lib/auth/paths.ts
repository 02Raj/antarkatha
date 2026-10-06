const INTERNAL = /^\/(?!\/)/;

export function safeInternalPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value) return fallback;
  if (!INTERNAL.test(value)) return fallback;
  if (value.startsWith("/login") || value.startsWith("/signup")) return fallback;
  return value;
}
