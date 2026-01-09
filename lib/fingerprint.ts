"use client";

const FINGERPRINT_KEY = "device_fingerprint";

export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  const stored = localStorage.getItem(FINGERPRINT_KEY);
  if (stored) return stored;

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width.toString(),
    screen.height.toString(),
    screen.colorDepth.toString(),
    new Date().getTimezoneOffset().toString(),
    (navigator.hardwareConcurrency || "unknown").toString(),
  ];

  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(components.join("|"))
  );

  const fingerprint =
    "fp_" +
    Array.from(new Uint8Array(hash))
      .slice(0, 8)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  return fingerprint;
}

export function getCachedFingerprint(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(FINGERPRINT_KEY);
}
