"use client"

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className = '' }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className={`bg-[#040c16]/50 rounded-lg p-5 border border-[#1e3a5f] shadow-lg ${className}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && (
          <div className="text-2xl opacity-80">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;