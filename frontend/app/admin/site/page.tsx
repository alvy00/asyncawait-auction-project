"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaSave, FaGlobe, FaEnvelope, FaLock, FaImage, FaMoneyBill, FaUserShield, FaServer } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

// Sample site settings data
const SAMPLE_SITE_SETTINGS = {
  general: {
    siteName: "AuctaSync",
    siteDescription: "The world's premier online auction platform",
    contactEmail: "support@auctasync.com",
    supportPhone: "+1 (555) 123-4567",
    address: "123 Auction Ave, San Francisco, CA 94105",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
  },
  appearance: {
    primaryColor: "#3b82f6",
    secondaryColor: "#ef863f",
    darkMode: true,
    showRecentAuctions: true,
    showFeaturedItems: true,
    itemsPerPage: 12,
  },
  auction: {
    defaultAuctionDuration: 7,
    minimumBidIncrement: 5,
    enableAutoBidding: true,
    enableBuyNow: true,
    enableReservePrice: true,
    enableProxyBidding: true,
  },
  email: {
    smtpServer: "smtp.auctasync.com",
    smtpPort: 587,
    smtpUsername: "notifications@auctasync.com",
    smtpPassword: "********",
    fromEmail: "no-reply@auctasync.com",
    enableEmailNotifications: true,
  },
  security: {
    enableTwoFactorAuth: true,
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    enableCaptcha: true,
  },
  payment: {
    currency: "USD",
    enablePayPal: true,
    enableStripe: true,
    enableCreditCard: true,
    transactionFeePercent: 2.5,
    minimumWithdrawal: 50,
  },
  social: {
    enableFacebookLogin: true,
    enableGoogleLogin: true,
    enableTwitterSharing: true,
    facebookAppId: "123456789",
    googleClientId: "google-client-id",
    twitterApiKey: "twitter-api-key",
  },
  advanced: {
    maintenanceMode: false,
    debugMode: false,
    cacheTimeout: 3600,
    maxUploadSize: 10,
    allowedFileTypes: "jpg,jpeg,png,gif,pdf",
    enableCDN: true,
  },
};

const SiteSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(SAMPLE_SITE_SETTINGS);
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveSettings = () => {
    // In a real app, you would call an API to save the settings
    toast.success("Settings saved successfully");
    setIsEditing(false);
  };

  const handleInputChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case 'general': return <FaGlobe className="h-5 w-5" />;
      case 'appearance': return <FaImage className="h-5 w-5" />;
      case 'auction': return <FaMoneyBill className="h-5 w-5" />;
      case 'email': return <FaEnvelope className="h-5 w-5" />;
      case 'security': return <FaLock className="h-5 w-5" />;
      case 'payment': return <FaMoneyBill className="h-5 w-5" />;
      case 'social': return <FaUserShield className="h-5 w-5" />;
      case 'advanced': return <FaServer className="h-5 w-5" />;
      default: return <FaGlobe className="h-5 w-5" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="text-white p-4 md:p-6 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Site Settings</h1>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
          >
            <FaSave size={14} />
            <span>Save Settings</span>
          </motion.button>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs */}
          <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl h-fit">
            <ul className="space-y-2">
              {Object.keys(settings).map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${activeTab === tab ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                  >
                    {getTabIcon(tab)}
                    <span className="capitalize">{tab}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-3 bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-6 border border-white/5 shadow-xl">
            <h2 className="text-xl font-bold mb-6 capitalize flex items-center gap-2">
              {getTabIcon(activeTab)}
              <span>{activeTab} Settings</span>
            </h2>

            <div className="space-y-6">
              {Object.entries(settings[activeTab as keyof typeof settings] || {}).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  
                  {typeof value === 'boolean' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange(activeTab, key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
                      />
                      <span className="ml-2 text-sm text-gray-400">
                        {value ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ) : typeof value === 'number' ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange(activeTab, key, parseFloat(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => handleInputChange(activeTab, key, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SiteSettingsPage;