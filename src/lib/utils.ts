import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = "/", base = process.env.NEXT_PUBLIC_APP_URL) {
  const origin = (base || "http://localhost:3000").replace(/\/+$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatMinutes(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) return "Under a minute";
  const rounded = Math.round(minutes);
  return `${rounded} min`;
}

export function formatDuration(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

/** Format integer paise as a rupee string, e.g. 9900 -> "₹99". */
export function formatPaise(paise: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: paise % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}
