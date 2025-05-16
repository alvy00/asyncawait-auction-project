"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaWallet, FaArrowUp, FaArrowDown, FaHistory, FaExchangeAlt, FaPlus, FaMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { User } from '../../../lib/interfaces';
import { Button } from '../../../components/ui/button';

// Sample transaction data
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bid' | 'win' | 'refund';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

const SAMPLE_USER: User = {
  name: "John Doe",
  email: "john@example.com",
  money: 2500.75,
  total_bids: 32,
  bids_won: 12
};

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    type: "deposit",
    amount: 500,
    date: "2023-11-15T14:30:00",
    status: "completed",
    description: "Added funds via credit card"
  },
  {
    id: "tx2",
    type: "bid",
    amount: -150,
    date: "2023-11-14T10:15:00",
    status: "completed",
    description: "Bid on Vintage Camera Collection"
  },
  {
    id: "tx3",
    type: "win",
    amount: -350,
    date: "2023-11-10T16:45:00",
    status: "completed",
    description: "Won auction for Antique Pocket Watch"
  },
  {
    id: "tx4",
    type: "refund",
    amount: 150,
    date: "2023-11-08T09:20:00",
    status: "completed",
    description: "Refund for outbid on Limited Edition Art Print"
  },
  {
    id: "tx5",
    type: "withdrawal",
    amount: -200,
    date: "2023-11-05T13:10:00",
    status: "completed",
    description: "Withdrawal to bank account"
  },
  {
    id: "tx6",
    type: "deposit",
    amount: 1000,
    date: "2023-11-01T11:05:00",
    status: "completed",
    description: "Added funds via PayPal"
  }
];

const WalletPage = () => {
  const [user, setUser] = useState<User>(SAMPLE_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals' | 'bids'>('all');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');

  // Simulate loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'deposits') return transaction.type === 'deposit' || transaction.type === 'refund';
    if (activeTab === 'withdrawals') return transaction.type === 'withdrawal';
    if (activeTab === 'bids') return transaction.type === 'bid' || transaction.type === 'win';
    return true;
  });

  // Calculate statistics
  const totalDeposits = transactions
    .filter(tx => tx.type === 'deposit' || tx.type === 'refund')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalSpentOnBids = transactions
    .filter(tx => tx.type === 'bid' || tx.type === 'win')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Handle deposit
  const handleDeposit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const depositAmount = Number(amount);
    
    // In a real app, you would make an API call here
    // Simulate successful deposit
    const newTransaction: Transaction = {
      id: `tx${transactions.length + 1}`,
      type: 'deposit',
      amount: depositAmount,
      date: new Date().toISOString(),
      status: 'completed',
      description: 'Added funds to wallet'
    };

    setTransactions([newTransaction, ...transactions]);
    setUser(prev => ({
      ...prev,
      money: prev.money + depositAmount
    }));

    setAmount('');
    setShowDepositModal(false);
    toast.success(`Successfully deposited $${depositAmount.toFixed(2)}`);
  };

  // Handle withdrawal
  const handleWithdrawal = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const withdrawalAmount = Number(amount);

    if (withdrawalAmount > user.money) {
      toast.error('Insufficient funds');
      return;
    }

    // In a real app, you would make an API call here
    // Simulate successful withdrawal
    const newTransaction: Transaction = {
      id: `tx${transactions.length + 1}`,
      type: 'withdrawal',
      amount: -withdrawalAmount,
      date: new Date().toISOString(),
      status: 'completed',
      description: 'Withdrawal to bank account'
    };

    setTransactions([newTransaction, ...transactions]);
    setUser(prev => ({
      ...prev,
      money: prev.money - withdrawalAmount
    }));

    setAmount('');
    setShowWithdrawModal(false);
    toast.success(`Successfully withdrew $${withdrawalAmount.toFixed(2)}`);
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <FaArrowUp className="text-green-500" />;
      case 'withdrawal':
        return <FaArrowDown className="text-red-500" />;
      case 'bid':
        return <FaExchangeAlt className="text-blue-500" />;
      case 'win':
        return <FaExchangeAlt className="text-purple-500" />;
      case 'refund':
        return <FaArrowUp className="text-green-500" />;
      default:
        return <FaHistory className="text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="min-h-screen py-12 px-4 sm:px-6">
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
            <FaWallet className="text-orange-500" />
            My Wallet
          </h1>
          <p className="text-gray-400 mt-2">Manage your funds and track your transactions</p>
        </motion.div>

        {/* Wallet Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Balance Card */}
          <div className="col-span-1 md:col-span-1">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 h-full p-6">
              <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
              
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Current Balance</h2>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-4">
                ${user.money.toFixed(2)}
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button 
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/20"
                >
                  <FaPlus size={14} /> Deposit
                </Button>
                <Button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20"
                >
                  <FaMinus size={14} /> Withdraw
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
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
              <p className="text-2xl font-bold text-white">${totalWithdrawals.toFixed(2)}</p>
            </div>

            {/* Total Spent on Bids */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/10 via-blue-300/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">Spent on Bids</h3>
                <FaExchangeAlt className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white">${totalSpentOnBids.toFixed(2)}</p>
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
            <Button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'all' 
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/20' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              All Transactions
            </Button>
            <Button
              onClick={() => setActiveTab('deposits')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'deposits' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              Deposits
            </Button>
            <Button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'withdrawals' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              Withdrawals
            </Button>
            <Button
              onClick={() => setActiveTab('bids')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'bids' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              Bids & Purchases
            </Button>
          </div>
          
          {/* Transactions List */}
          <div className="space-y-4">
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
                      <p className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${{
                        'completed': 'bg-green-500/20 text-green-400',
                        'pending': 'bg-yellow-500/20 text-yellow-400',
                        'failed': 'bg-red-500/20 text-red-400'
                      }[transaction.status]}`}>
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
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6 max-w-md w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>
            
            <h2 className="text-xl font-bold text-white mb-4">Deposit Funds</h2>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleDeposit}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                Deposit
              </Button>
              <Button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6 max-w-md w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>
            
            <h2 className="text-xl font-bold text-white mb-4">Withdraw Funds</h2>
            <div className="mb-4">
              <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  id="withdraw-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  max={user.money}
                  step="0.01"
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">Available balance: ${user.money.toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleWithdrawal}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                Withdraw
              </Button>
              <Button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;