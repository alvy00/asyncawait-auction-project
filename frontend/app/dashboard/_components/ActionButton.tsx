"use client"

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  href: string;
  icon: ReactNode;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ href, icon, label }) => {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#040c16]/50 hover:bg-[#07244d]/70 border border-[#1e3a5f] rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors"
      >
        <span className="text-[#7b62fb]">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </motion.div>
    </Link>
  );
};

export default ActionButton;