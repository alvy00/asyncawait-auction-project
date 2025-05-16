"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const DeleteAccountSection = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  
  const handleRequestDelete = () => {
    setShowConfirmation(true);
  };
  
  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setConfirmText("");
  };
  
  const handleConfirmDelete = () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    
    // In a real app, you would make an API call here
    toast.success("Account deletion process initiated. You will receive an email with further instructions.");
    setShowConfirmation(false);
    setConfirmText("");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 via-red-400/5 to-transparent backdrop-blur-xl shadow-2xl border border-red-500/20 p-6"
    >
      <div className="absolute -inset-1 bg-gradient-to-tr from-red-500/10 via-red-300/5 to-red-500/10 opacity-30 transition-opacity duration-700"></div>
      
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="text-red-400" />
        Delete Account
      </h2>
      
      <p className="text-gray-300 mb-6">
        Once you delete your account, there is no going back. This action is permanent and will remove all your data from our systems.
      </p>
      
      {!showConfirmation ? (
        <Button
          onClick={handleRequestDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-red-500/20"
        >
          Delete Account
        </Button>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-red-500/20 p-4 rounded-lg">
          <p className="text-white mb-3">To confirm, type <strong>DELETE</strong> in the field below:</p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
            placeholder="Type DELETE to confirm"
          />
          <div className="flex gap-3">
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-red-500/20"
            >
              Permanently Delete Account
            </Button>
            <Button
              onClick={handleCancelDelete}
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DeleteAccountSection;