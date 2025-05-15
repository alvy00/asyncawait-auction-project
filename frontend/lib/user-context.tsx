/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // This line ensures the file is treated as a client component

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
    // Attempt to load user data from localStorage or sessionStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Restore the user from localStorage
    } else {
      const token = localStorage.getItem('sessionToken') || sessionStorage.getItem('sessionToken');
      if (token) {
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
              console.error('Failed to fetch user');
              return;
            }

            const data = await res.json();
            setUser(data);

            // Persist user data in localStorage
            localStorage.setItem('user', JSON.stringify(data));
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };

        fetchUser();
      }
    }
  }, []);

  useEffect(() => {
    // Watch for changes in user and update localStorage accordingly
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // Remove user from localStorage if logged out
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
