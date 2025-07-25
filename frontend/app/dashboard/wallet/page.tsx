/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaExchangeAlt,
  FaPlus,
  FaMinus,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { useUser } from "../../../lib/user-context";
import { useAuth } from "../../../lib/auth-context";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "bid" | "win" | "refund";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    type: "deposit",
    amount: 500,
    date: "2023-11-15T14:30:00",
    status: "completed",
    description: "Added funds via credit card",
  },
  {
    id: "tx2",
    type: "bid",
    amount: -150,
    date: "2023-11-14T10:15:00",
    status: "completed",
    description: "Bid on Vintage Camera Collection",
  },
  {
    id: "tx3",
    type: "win",
    amount: -350,
    date: "2023-11-10T16:45:00",
    status: "completed",
    description: "Won auction for Antique Pocket Watch",
  },
  {
    id: "tx4",
    type: "refund",
    amount: 150,
    date: "2023-11-08T09:20:00",
    status: "completed",
    description: "Refund for outbid on Limited Edition Art Print",
  },
  {
    id: "tx5",
    type: "withdrawal",
    amount: -200,
    date: "2023-11-05T13:10:00",
    status: "completed",
    description: "Withdrawal to bank account",
  },
  {
    id: "tx6",
    type: "deposit",
    amount: 1000,
    date: "2023-11-01T11:05:00",
    status: "completed",
    description: "Added funds via PayPal",
  },
];

const WalletPage = () => {
  const { user } = useUser();
  const [balance, setBalance] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [withdrawals, setWithdrawals] = useState(0);
  const [spentOnAucs, setSpentOnAucs] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "deposits" | "withdrawals" | "bids">("all");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  
  // Loading check
  useEffect(() => {
    if (!user) {
      setIsLoading(true);
    } else {
      setBalance(user.money ?? 0);
      setTotalDeposits(user.total_deposits ?? 0);
      setWithdrawals(user.total_withdrawals ?? 0);
      setSpentOnAucs(user.spent_on_bids ?? 0);
      setIsLoading(false);
    }
  }, [user]);

  const filteredTransactions = transactions.filter((transaction) => {
    switch (activeTab) {
      case "all":
        return true;
      case "deposits":
        return transaction.type === "deposit" || transaction.type === "refund";
      case "withdrawals":
        return transaction.type === "withdrawal";
      case "bids":
        return transaction.type === "bid" || transaction.type === "win";
      default:
        return true;
    }
  });

  // Handle deposit
  const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!depositAmount) {
      toast.error("Please enter an amount");
      return;
    }

    const numericAmount = Number(depositAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const data = { user_id: user.user_id, amount: numericAmount };

      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Deposit failed");
        return;
      }

      setBalance(balance + numericAmount);
      setTotalDeposits(totalDeposits + numericAmount);
      toast.success("Deposit successful!");

      setShowDepositModal(false);
      setDepositAmount("");  // reset deposit input

    } catch (error) {
      console.error(error);
      alert("An error occurred during deposit");
    }
  };

  // Handle withdrawal
  const handleWithdrawal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!withdrawAmount) {
      toast.error("Please enter a valid amount");
      return;
    }

    const numericAmount = Number(withdrawAmount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (numericAmount > (user?.money ?? 0)) {
      toast.error("Insufficient funds");
      return;
    }

    try {
      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.user_id, amount: numericAmount }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Withdrawal failed");
        return;
      }

      toast.success(`Successfully withdrew $${numericAmount.toFixed(2)}`);
      setBalance(balance - numericAmount);
      setWithdrawals(withdrawals + numericAmount);
      setWithdrawAmount(""); // Clear withdrawal input
      setShowWithdrawModal(false);

    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("An error occurred during withdrawal");
    }
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <FaArrowUp className="text-green-500" />;
      case "withdrawal":
        return <FaArrowDown className="text-red-500" />;
      case "bid":
        return <FaExchangeAlt className="text-blue-500" />;
      case "win":
        return <FaExchangeAlt className="text-purple-500" />;
      case "refund":
        return <FaArrowUp className="text-green-500" />;
      default:
        return <FaHistory className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 relative bg-[#0f172a]">
      {/* Background gradients */}
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
            <FaWallet className="text-orange-500" />
            My Wallet
          </h1>
          <p className="text-gray-400 mt-2">Manage your funds and track your transactions</p>
        </motion.div>

        {/* Wallet overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Balance card */}
          <div>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 h-full p-6">
              <div className="pointer-events-none absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>

              <h2 className="text-lg font-semibold text-gray-300 mb-2">Current Balance</h2>
              { user && 
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-4">
                  ${balance.toFixed(2)}
                </div>
              }

              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowDepositModal(true);
                    setAmount("");
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  <FaPlus size={14} /> Deposit
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(true);
                    setAmount("");
                  }}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  <FaMinus size={14} /> Withdraw
                </Button>
              </div>
              
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:col-span-2">
            {/* Total Deposits */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6">
              <div className="absolute -inset-1 bg-gradient-to-tr from-green-500/10 via-green-300/5 to-green-500/10 opacity-30 transition-opacity duration-700"></div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">Total Deposits</h3>
                <FaArrowUp className="text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white">${totalDeposits.toFixed(2)}</p>
            </div>

            {/* Total Withdrawals */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6">
              <div className="absolute -inset-1 bg-gradient-to-tr from-red-500/10 via-red-300/5 to-red-500/10 opacity-30 transition-opacity duration-700"></div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">Total Withdrawals</h3>
                <FaArrowDown className="text-red-500" />
              </div>
              <p className="text-2xl font-bold text-white">${withdrawals.toFixed(2)}</p>
            </div>

            {/* Spent on Bids */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/10 via-blue-300/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">Spent on Bids</h3>
                <FaExchangeAlt className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white">${spentOnAucs.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6"
        >
          <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>

          <h2 className="text-xl font-bold text-white mb-6">Transaction History</h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "all", label: "All Transactions", from: "orange-500", to: "pink-600" },
              { id: "deposits", label: "Deposits", from: "green-500", to: "green-600" },
              { id: "withdrawals", label: "Withdrawals", from: "red-500", to: "red-600" },
              { id: "bids", label: "Bids & Purchases", from: "blue-500", to: "purple-600" },
            ].map(({ id, label, from, to }) => (
              <Button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === id
                    ? `bg-gradient-to-r from-${from} to-${to} text-white shadow-lg shadow-${from}/20`
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Transactions list */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{transaction.description}</h3>
                        <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transaction.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toFixed(2)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          {
                            completed: "bg-green-500/20 text-green-400",
                            pending: "bg-yellow-500/20 text-yellow-400",
                            failed: "bg-red-500/20 text-red-400",
                          }[transaction.status]
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No transactions found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6 max-w-md w-full"
            >
              <button
                onClick={() => setShowDepositModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
                aria-label="Close deposit modal"
              >
                <FaTimes size={20} />
              </button>

              <h3 className="text-lg font-semibold text-white mb-4">Deposit Funds</h3>
              <form onSubmit={handleDeposit} className="...">
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full mb-4 rounded-md border border-white/20 bg-transparent py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex justify-end gap-4">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 cursor-pointer">
                    Deposit
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setShowDepositModal(false)}
                    variant="outline"
                    className="text-black cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
      {showWithdrawModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <motion.form
            onSubmit={handleWithdrawal}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6 max-w-md w-full"
          >
            <button
              type="button"
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              aria-label="Close withdraw modal"
            >
              <FaTimes size={20} />
            </button>

            <h3 className="text-lg font-semibold text-white mb-4">Withdraw Funds</h3>

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full mb-4 rounded-md border border-white/20 bg-transparent py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-4">
              <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">
                Withdraw
              </Button>

              <Button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                variant="outline"
                className="text-black cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default WalletPage;
