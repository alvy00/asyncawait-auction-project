"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import supabase from "../lib/supabasebrowserClient";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "../lib/interfaces";
import { useAuth } from "./auth-context";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  refetchIndex: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isReady } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refreshUser = useCallback(async () => {
    if (!isReady) return;
    setIsLoading(true);
    try {
      // Get current session
      const { data: sessionData, error } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (error) {
        console.warn("🔒 Supabase session error:", error.message);
        setUser(null);
        setSupabaseUser(null);
        return;
      }

      // If no valid session or user, clear state & bail
      if (!session || !session.access_token || !session.user) {
        console.warn("🔒 No valid session or user found.");
        setUser(null);
        setSupabaseUser(null);
        return;
      }

      // Save Supabase user
      setSupabaseUser(session.user);

      // Fetch your app user from backend using Supabase JWT token
      const response = await fetch(
        "https://asyncawait-auction-project.onrender.com/api/getuser",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error fetching app user:", errorText);
        setUser(null);
      } else {
        const userData = await response.json();
        setUser(userData);
        console.log("✅ App user loaded:", userData);
      }
    } catch (err) {
      console.error("❌ Failed to fetch app user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
      setRefetchIndex((i) => i + 1);
    }
  }, [isReady]);

  // Run on mount and when refetchIndex changes, only if isReady is true
  useEffect(() => {
    if (!isReady) return;

    // Subscribe to Supabase auth changes to refresh user accordingly
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 Auth state changed (UserProvider):", event);

        if (session?.access_token && session.user) {
          setSupabaseUser(session.user);
          refreshUser();
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setRefetchIndex((i) => i + 1);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [refreshUser, isReady]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        supabaseUser,
        isLoading,
        refreshUser,
        refetchIndex,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
