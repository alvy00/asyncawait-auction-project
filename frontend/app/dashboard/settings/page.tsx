"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, UserCircle, CreditCard, Bell, Shield } from "lucide-react";
import { User as UserType } from "../../../lib/interfaces";

// Import components
import ProfileSettings from "./_components/ProfileSettings";
import PaymentMethods from "./_components/PaymentMethods";
import NotificationSettings from "./_components/NotificationSettings";
import SecuritySettings from "./_components/SecuritySettings";
import DeleteAccountSection from "./_components/DeleteAccountSection";


type TabType = "profile" | "payment" | "notifications" | "security";

const SettingsPage = () => {
  const [user, setUser] = useState<UserType>(null);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isLoading, setIsLoading] = useState(false);


  // fetch User
  useEffect(() => {
    setIsLoading(true);

    const getUser = async () => {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
      if (!token) return

      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Failed to fetch user:", err.message);
          setUser(undefined);
          return;
        }

        const data = await res.json();
        setUser(data);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching user:", e);
        setUser(undefined);
      }
    };
    getUser();
  }, []);

  // Simulate loading effect
  useState(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  });

  const handleUpdateUser = (updatedUser: Partial<UserType>) => {
    setUser({ ...user, ...updatedUser });
    // In a real app, you would make an API call here
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <UserCircle className="h-5 w-5" /> },
    { id: "payment", label: "Payment Methods", icon: <CreditCard className="h-5 w-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
    { id: "security", label: "Security", icon: <Shield className="h-5 w-5" /> },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-10 min-h-screen py-12 px-4 sm:px-6">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full filter blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-[250px] h-[250px] bg-purple-500/10 rounded-full filter blur-[60px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-blue-500/10 rounded-full filter blur-[50px] animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <User className="text-orange-500" />
            Account Settings
          </h1>
          <p className="text-gray-400 mt-2">Manage your profile, payment methods, and security preferences</p>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "profile" && (
            <ProfileSettings user={user} onUpdate={handleUpdateUser} />
          )}
          
          {activeTab === "payment" && (
            <PaymentMethods />
          )}
          
          {activeTab === "notifications" && (
            <NotificationSettings />
          )}
          
          {activeTab === "security" && (
            <>
            <SecuritySettings />
            <DeleteAccountSection />
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;