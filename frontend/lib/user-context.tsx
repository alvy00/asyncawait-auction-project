/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('sessionToken') || sessionStorage.getItem('sessionToken');
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getuser', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch user, status:', res.status);
          setUser(null);
          localStorage.removeItem('user');
          return;
        }

        const data = await res.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
