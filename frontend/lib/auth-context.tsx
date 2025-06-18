"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type AuthContextType = {
  loggedIn: boolean;
  login: (token: string, remember: boolean) => void;
  logout: (reason?: "manual" | "expired") => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const getToken = () =>
    localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");

  const getExpiresAt = () =>
    parseInt(
      localStorage.getItem("expiresAt") || sessionStorage.getItem("expiresAt") || "0",
      10
    );

  const clearSession = () => {
    localStorage.removeItem("sessionToken");
    sessionStorage.removeItem("sessionToken");
    localStorage.removeItem("expiresAt");
    sessionStorage.removeItem("expiresAt");
    setLoggedIn(false);
  };

  const logout = (reason: "manual" | "expired" = "manual") => {
    clearSession();
    localStorage.setItem("authChange", Date.now().toString()); // sync to other tabs
    if (reason === "expired") {
      toast.error("You were logged out due to inactivity");
    }
    router.push("/login");
  };

  const login = (token: string, remember: boolean) => {
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("sessionToken", token);
    storage.setItem("expiresAt", expiresAt.toString());

    setLoggedIn(true);
  };

  // Initial auth check
  useEffect(() => {
    const token = getToken();
    const expiresAt = getExpiresAt();

    if (token && Date.now() < expiresAt) {
      setLoggedIn(true);
    } else {
      clearSession();
    }
  }, []);

  // Interval check for session expiration
  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAt = getExpiresAt();
      if (expiresAt && Date.now() >= expiresAt) {
        logout("expired");
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Check expiration on tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const expiresAt = getExpiresAt();
        if (expiresAt && Date.now() >= expiresAt) {
          logout("expired");
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Multi-tab logout sync
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === "authChange") {
        clearSession();
        router.push("/login");
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
