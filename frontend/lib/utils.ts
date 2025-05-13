/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auction } from "@frontend/types/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Login logics-----------------------
export const setSessionToken = (token: string, remember: boolean, expiresInSeconds: number = 3600) => {
  const expiry = Date.now() + expiresInSeconds * 1000;
  const storage = remember ? localStorage : sessionStorage;

  storage.setItem("sessionToken", token);
  storage.setItem("sessionExpiry", expiry.toString());
};

export const getSessionToken = () => {
  return localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
};

export const clearSessionToken = () => {
  localStorage.removeItem("sessionToken");
  sessionStorage.removeItem("sessionToken");
};

export const isSessionExpired = (): boolean => {
  const expiryStr = localStorage.getItem("sessionExpiry") || sessionStorage.getItem("sessionExpiry");
  if (!expiryStr) return true;

  const expiry = parseInt(expiryStr, 10);
  return Date.now() > expiry;
};


export const getUserIdFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];

    const base64Url = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64Url.length % 4 === 0 ? "" : "=".repeat(4 - (base64Url.length % 4));
    const base64 = base64Url + padding;

    const decodedPayload = JSON.parse(atob(base64));

    return decodedPayload.userId || null;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

//--------------------


//Auction logics--------------------

export const fetchAllAuctions = async (): Promise<Auction[] | null> => {
  try {
    const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch auctions: ${res.statusText}`);
    }

    const result: Auction[] = await res.json();
    return result;
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('Error fetching auctions:', e.message);
    } else {
      console.error('An unknown error occurred', e);
    }

    return null;
  }
};