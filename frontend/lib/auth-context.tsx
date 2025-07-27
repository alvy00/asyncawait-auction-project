/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import supabase from "../lib/supabasebrowserClient";

type AuthContextType = {
  loggedIn: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: (reason?: "manual" | "expired") => Promise<void>;
  token?: string;
  user?: any;
  refreshUserSignal: number;
  refreshUser: () => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [user, setUser] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [refreshUserSignal, setRefreshUserSignal] = useState(0);
  const router = useRouter();

  const refreshUser = useCallback(() => {
    setRefreshUserSignal((count) => count + 1);
  }, []);

  const logout = async (reason: "manual" | "expired" = "manual") => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error.message);
        toast.error("Logout failed: " + error.message);
        return;
      }

      localStorage.removeItem("sessionToken");
      localStorage.removeItem("expiresAt");
      sessionStorage.removeItem("sessionToken");
      sessionStorage.removeItem("expiresAt");

      setLoggedIn(false);
      setUser(null);
      setToken(undefined);
      refreshUser();

      localStorage.setItem("authChange", Date.now().toString());

      if (reason === "expired") toast.error("You were logged out due to inactivity.");

      setTimeout(() => {
        if (window.location.pathname !== "/login") {
          router.replace("/login");
        }
      }, 50);
    } catch (err) {
      console.error("Unexpected logout error:", err);
      toast.error("Unexpected logout error");
    }
  };

  const login = async (email: string, password: string, remember: boolean) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      toast.error("Login failed: " + (error?.message || "Unknown error"));
      return;
    }

    const session = data.session;
    const accessToken = session.access_token;

    setToken(accessToken);
    setUser(session.user);
    setLoggedIn(true);
    refreshUser();
    router.push("/");
  };

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;

        if (session && !error) {
          const exp = session.expires_at ? session.expires_at * 1000 : 0;
          if (Date.now() < exp) {
            setToken(session.access_token);
            setUser(session.user);
            setLoggedIn(true);
          } else {
            await logout("expired");
          }
        } else {
          setLoggedIn(false);
          setUser(null);
          setToken(undefined);
        }
      } catch (err) {
        console.error("Error restoring session:", err);
        setLoggedIn(false);
        setUser(null);
        setToken(undefined);
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, []);

  // Listen to Supabase auth changes
  useEffect(() => {
    const hasShownToast = { current: false };

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token) {
        setToken((prev) => {
          if (prev !== session.access_token) {
            setLoggedIn(true);
            setUser(session.user);
            if (!hasShownToast.current) {
              //toast.success("Logged in!");
              hasShownToast.current = true;
            }
            refreshUser();
            return session.access_token;
          }
          return prev;
        });
      } else {
        setToken((prev) => {
          if (prev !== undefined) {
            setLoggedIn(false);
            setUser(null);
            refreshUser();
            hasShownToast.current = false;
            return undefined;
          }
          return prev;
        });
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [refreshUser]);

  // Periodically check session expiry
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getSession();
      const exp = data?.session?.expires_at;
      if (exp && Date.now() >= exp * 1000) {
        await logout("expired");
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Check on tab focus
  useEffect(() => {
    const onFocus = async () => {
      const { data } = await supabase.auth.getSession();
      const exp = data?.session?.expires_at;
      if (exp && Date.now() >= exp * 1000) {
        await logout("expired");
      }
    };
    document.addEventListener("visibilitychange", onFocus);
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, []);

  // Cross-tab logout sync
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === "authChange") {
        logout("expired");
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        login,
        logout,
        token,
        user,
        refreshUserSignal,
        refreshUser,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
