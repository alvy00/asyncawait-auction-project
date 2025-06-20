"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type AuthContextType = {
  loggedIn: boolean;
  login: (token: string, remember: boolean) => void;
  logout: (reason?: "manual" | "expired") => void;
  token?: string;
  expiresAt?: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [expiresAt, setExpiresAt] = useState<number | undefined>();
  const router = useRouter();

  const getToken = () =>
    localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");

  const getExpiresAt = () => {
    const raw = localStorage.getItem("expiresAt") || sessionStorage.getItem("expiresAt");
    const parsed = parseInt(raw || "", 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const clearSession = () => {
    localStorage.removeItem("sessionToken");
    sessionStorage.removeItem("sessionToken");
    localStorage.removeItem("expiresAt");
    sessionStorage.removeItem("expiresAt");
    setLoggedIn(false);
    setToken(undefined);
    setExpiresAt(undefined);
  };

  const logout = (reason: "manual" | "expired" = "manual") => {
    clearSession();
    localStorage.setItem("authChange", Date.now().toString()); // sync to other tabs
    if (reason === "expired") {
      toast.error("You were logged out due to inactivity");
    }
    if (window.location.pathname !== "/login") {
      router.push("/login");
    }
  };

  const login = (tokenValue: string, remember: boolean) => {
    const exp = Date.now() + 60 * 60 * 1000; // 1 hour
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("sessionToken", tokenValue);
    storage.setItem("expiresAt", exp.toString());

    setLoggedIn(true);
    setToken(tokenValue);
    setExpiresAt(exp);
  };

  // Initial check
  useEffect(() => {
    const existingToken = getToken();
    const exp = getExpiresAt();

    if (existingToken && Date.now() < exp) {
      setLoggedIn(true);
      setToken(existingToken);
      setExpiresAt(exp);
    } else {
      clearSession();
    }
  }, []);

  // Session expiration check every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const exp = getExpiresAt();
      if (exp && Date.now() >= exp) {
        logout("expired");
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [router]);

  // Check expiration on tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const exp = getExpiresAt();
        if (exp && Date.now() >= exp) {
          logout("expired");
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [router]);

  // Multi-tab logout sync
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === "authChange") {
        logout("expired"); // this clears and redirects appropriately
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, [router]);

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, token, expiresAt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
