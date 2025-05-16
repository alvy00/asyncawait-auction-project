"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { Lock, Shield, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    // In a real app, you would make an API call here
    toast.success("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`); 
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6"
    >
      <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>
      
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Lock className="text-orange-400" />
        Security Settings
      </h2>
      
      {/* Password Change Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
      
      {/* Two-Factor Authentication */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="text-green-400" />
          Two-Factor Authentication
        </h3>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
          <p className="text-gray-300 mb-3">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
            <Button
              onClick={toggleTwoFactor}
              className={`${twoFactorEnabled 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-white/10 hover:bg-white/20'} text-white font-medium py-2 px-4 rounded-lg transition-all duration-300`}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Account Activity */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="text-yellow-400" />
          Recent Account Activity
        </h3>
        
        <div className="space-y-3">
          {[
            { device: "Windows PC", location: "New York, USA", time: "Today, 10:30 AM", current: true },
            { device: "iPhone 13", location: "New York, USA", time: "Yesterday, 8:45 PM" },
            { device: "MacBook Pro", location: "Boston, USA", time: "Oct 15, 2023, 3:20 PM" }
          ].map((session, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10 flex justify-between items-center">
              <div>
                <div className="text-white font-medium">{session.device}</div>
                <div className="text-gray-400 text-sm">{session.location} • {session.time}</div>
              </div>
              {session.current && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  Current Session
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SecuritySettings;