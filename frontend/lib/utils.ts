/* eslint-disable @typescript-eslint/no-unused-vars */
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
//--------------------


//Auction logics--------------------

export const fetchAllAuctions = async () => {
    try{
      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions', {
        method: "GET",
        headers: {
          'Content-type': 'application/json'
        }
      })

      const result = await res.json();

      return result;
    }catch(e){
      console.error("Error fetching auctions", e);
    }
}