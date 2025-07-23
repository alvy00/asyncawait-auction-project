/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auction } from "@frontend/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------
// Session Token Management (Supabase-Compatible)
// -----------------------------

const ACCESS_TOKEN_KEY = "sb-access-token";
const REFRESH_TOKEN_KEY = "sb-refresh-token";
const EXPIRY_KEY = "sb-token-expiry";

export const setSessionToken = (
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  remember: boolean
) => {
  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  storage.setItem(EXPIRY_KEY, (expiresAt * 1000).toString());
};

export const getSessionToken = (): string | null => {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
};

export const getRefreshToken = (): string | null => {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
};

export const isSessionExpired = (): boolean => {
  const expiryStr =
    localStorage.getItem(EXPIRY_KEY) || sessionStorage.getItem(EXPIRY_KEY);
  if (!expiryStr) return true;

  const expiry = parseInt(expiryStr, 10);
  return Date.now() > expiry;
};

export const clearSessionToken = (): void => {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(EXPIRY_KEY);
  });
};

// Decode JWT to extract user ID (from `sub`)
export const getUserIdFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decodedPayload = JSON.parse(atob(padded));

    // Supabase access_token uses `sub` as the user ID
    return decodedPayload.sub || null;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

// -----------------------------
// Auction Fetching
// -----------------------------

export const fetchAllAuctions = async (): Promise<Auction[] | null> => {
  try {
    const res = await fetch(
      "https://asyncawait-auction-project.onrender.com/api/auctions"
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch auctions: ${res.statusText}`);
    }

    const result: Auction[] = await res.json();
    return result;
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error fetching auctions:", e.message);
    } else {
      console.error("An unknown error occurred", e);
    }
    return null;
  }
};
