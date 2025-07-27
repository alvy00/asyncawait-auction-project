/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaCreditCard, FaTimes, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface PayNowModalProps {
  open: boolean;
  onClose: () => void;
  onWalletPay: () => Promise<void>;
  onSSLCOMMERZPay: () => Promise<void>;
  userBalance: number;
  amount: number;
}

export default function PayNowModal({
  open,
  onClose,
  onWalletPay,
  onSSLCOMMERZPay,
  userBalance,
  amount,
}: PayNowModalProps) {
  const [loadingMethod, setLoadingMethod] = useState<"wallet" | "ssl" | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const canPayFromWallet = userBalance >= amount;

  const handleWalletPay = async () => {
    setLoadingMethod("wallet");
    try {
      await onWalletPay();
      setPaymentSuccess(true);
    } finally {
      setLoadingMethod(null);
    }
  };

  const handleSSLCOMMERZPay = async () => {
    setLoadingMethod("ssl");
    try {
      await onSSLCOMMERZPay();
      setPaymentSuccess(true);
    } finally {
      setLoadingMethod(null);
    }
  };

  const handleClose = () => {
    setPaymentSuccess(false);
    setLoadingMethod(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="max-w-md w-full p-6 bg-zinc-900 text-white rounded-xl shadow-lg border border-white/10"
        hideClose
      >
        <DialogTitle></DialogTitle>
        <AnimatePresence mode="wait">
          <motion.div
            key={paymentSuccess ? "success" : "form"}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-wide">
                {paymentSuccess ? "Payment Successful" : "Choose Payment Method"}
              </h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-red-400 transition"
                aria-label="Close payment modal"
              >
                <FaTimes />
              </button>
            </div>

            {/* Confirmation View */}
            {paymentSuccess ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <FaCheckCircle className="text-5xl text-emerald-400 animate-pulse" />
                <p className="text-lg font-semibold text-white/90">Thank you! Your payment was successful.</p>
                <button
                  onClick={handleClose}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Pay from Wallet */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWalletPay}
                  disabled={!canPayFromWallet || loadingMethod !== null}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border border-emerald-500 bg-emerald-700 text-white font-medium shadow transition-all",
                    {
                      "hover:bg-emerald-600 cursor-pointer": canPayFromWallet && !loadingMethod,
                      "opacity-50 cursor-not-allowed": !canPayFromWallet || loadingMethod,
                    }
                  )}
                >
                  <div className="flex items-center gap-3">
                    <FaWallet className="text-xl" />
                    <span>Pay from Wallet</span>
                  </div>
                  {loadingMethod === "wallet" ? (
                    <span className="text-sm font-mono animate-pulse">Processing...</span>
                  ) : (
                    <span className="text-sm font-mono">Balance: ${userBalance?.toFixed(2)}</span>
                  )}
                </motion.button>

                {/* Pay with SSLCOMMERZ */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSSLCOMMERZPay}
                  disabled={loadingMethod !== null}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border border-yellow-400 bg-yellow-600 text-white font-medium shadow transition-all",
                    {
                      "hover:bg-yellow-500 cursor-pointer": !loadingMethod,
                      "opacity-50 cursor-not-allowed": loadingMethod,
                    }
                  )}
                >
                  <div className="flex items-center gap-3">
                    <FaCreditCard className="text-xl" />
                    <span>Pay with SSLCOMMERZ</span>
                  </div>
                  {loadingMethod === "ssl" ? (
                    <span className="text-sm font-mono animate-pulse">Redirecting...</span>
                  ) : (
                    <span className="text-sm font-mono">Via card/mobile</span>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
