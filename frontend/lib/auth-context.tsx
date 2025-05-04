"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  loggedIn: boolean;
  login: (token: string, remember: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
    setLoggedIn(!!token);
  }, []);

  const login = (token: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem("sessionToken", token);
    } else {
      sessionStorage.setItem("sessionToken", token);
    }
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("sessionToken");
    sessionStorage.removeItem("sessionToken");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
