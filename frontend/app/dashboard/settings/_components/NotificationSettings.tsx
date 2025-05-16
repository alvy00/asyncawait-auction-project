"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: {
      newBids: true,
      outbid: true,
      auctionEnding: true,
      wonAuction: true,
      newsletter: false
    },
    push: {
      newBids: true,
      outbid: true,
      auctionEnding: true,
      wonAuction: true,
      promotions: false
    },
    sms: {
      outbid: false,
      auctionEnding: false,
      wonAuction: true
    }
  });
  
  const handleToggle = (category: 'email' | 'push' | 'sms', setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]]
      }
    }));
  };
  
  const saveSettings = () => {
    // In a real app, you would make an API call here
    toast.success("Notification preferences updated");
  };
  
  const NotificationToggle = ({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-white">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-gradient-to-r from-orange-500 to-pink-600' : 'bg-white/10'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6"
    >
      <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>
      
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Bell className="text-orange-400" />
        Notification Preferences
      </h2>
      
      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Mail className="text-blue-400" size={18} />
            Email Notifications
          </h3>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
            <NotificationToggle 
              checked={settings.email.newBids} 
              onChange={() => handleToggle('email', 'newBids')} 
              label="New bids on your auctions" 
            />
            <NotificationToggle 
              checked={settings.email.outbid} 
              onChange={() => handleToggle('email', 'outbid')} 
              label="When you've been outbid" 
            />
            <NotificationToggle 
              checked={settings.email.auctionEnding} 
              onChange={() => handleToggle('email', 'auctionEnding')} 
              label="Auctions ending soon" 
            />
            <NotificationToggle 
              checked={settings.email.wonAuction} 
              onChange={() => handleToggle('email', 'wonAuction')} 
              label="When you win an auction" 
            />
            <NotificationToggle 
              checked={settings.email.newsletter} 
              onChange={() => handleToggle('email', 'newsletter')} 
              label="Weekly newsletter" 
            />
          </div>
        </div>
        
        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <MessageSquare className="text-purple-400" size={18} />
            Push Notifications
          </h3>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
            <NotificationToggle 
              checked={settings.push.newBids} 
              onChange={() => handleToggle('push', 'newBids')} 
              label="New bids on your auctions" 
            />
            <NotificationToggle 
              checked={settings.push.outbid} 
              onChange={() => handleToggle('push', 'outbid')} 
              label="When you've been outbid" 
            />
            <NotificationToggle 
              checked={settings.push.auctionEnding} 
              onChange={() => handleToggle('push', 'auctionEnding')} 
              label="Auctions ending soon" 
            />
            <NotificationToggle 
              checked={settings.push.wonAuction} 
              onChange={() => handleToggle('push', 'wonAuction')} 
              label="When you win an auction" 
            />
            <NotificationToggle 
              checked={settings.push.promotions} 
              onChange={() => handleToggle('push', 'promotions')} 
              label="Promotions and special offers" 
            />
          </div>
        </div>
        
        {/* SMS Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Smartphone className="text-green-400" size={18} />
            SMS Notifications
          </h3>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
            <NotificationToggle 
              checked={settings.sms.outbid} 
              onChange={() => handleToggle('sms', 'outbid')} 
              label="When you've been outbid" 
            />
            <NotificationToggle 
              checked={settings.sms.auctionEnding} 
              onChange={() => handleToggle('sms', 'auctionEnding')} 
              label="Auctions ending soon" 
            />
            <NotificationToggle 
              checked={settings.sms.wonAuction} 
              onChange={() => handleToggle('sms', 'wonAuction')} 
              label="When you win an auction" 
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button
          onClick={saveSettings}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20"
        >
          Save Preferences
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;