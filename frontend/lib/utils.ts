/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auction } from "@frontend/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------
// Session Token Management
// -----------------------------

const EXPIRY_KEY = "sessionExpiry";
const TOKEN_KEY = "sessionToken";

export const setSessionToken = (
  token: string,
  remember: boolean,
  expiresInSeconds: number = 3600 // default: 1 hour
) => {
  const expiry = Date.now() + expiresInSeconds * 1000;
  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(EXPIRY_KEY, expiry.toString());
};

export const getSessionToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const clearSessionToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  sessionStorage.removeItem(EXPIRY_KEY);
};

export const isSessionExpired = (): boolean => {
  const expiryStr = localStorage.getItem(EXPIRY_KEY) || sessionStorage.getItem(EXPIRY_KEY);
  if (!expiryStr) return true;

  const expiry = parseInt(expiryStr, 10);
  return Date.now() > expiry;
};

// Decode JWT token to extract userId (if encoded in payload)
export const getUserIdFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decodedPayload = JSON.parse(atob(padded));

    return decodedPayload.userId || null;
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
    const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions");

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
