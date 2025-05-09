"use client";

import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '../../components/BackButton';

const TermsPage = () => {
  // Terms sections data
  const termsSections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using AuctaSync, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services."
    },
    {
      title: "2. User Registration",
      content: "To participate in auctions, you must register an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account. You must provide accurate and complete information during registration and keep your information updated."
    },
    {
      title: "3. Auction Rules",
      content: "All bids are binding offers to purchase. Once placed, bids cannot be retracted except under exceptional circumstances determined by AuctaSync. The highest valid bid at the auction close wins the item. AuctaSync reserves the right to remove bids that appear fraudulent or manipulative."
    },
    {
      title: "4. Payments and Fees",
      content: "Successful bidders must complete payment within 48 hours of auction close. AuctaSync charges a buyer's premium of 5% on all successful purchases. Late payments may result in cancellation of the sale and account restrictions."
    },
    {
      title: "5. Item Descriptions",
      content: "While sellers strive to provide accurate descriptions, AuctaSync does not verify item descriptions and is not responsible for any inaccuracies. Buyers are encouraged to ask questions before bidding."
    },
    {
      title: "6. Shipping and Delivery",
      content: "Sellers are responsible for shipping items within 5 business days of receiving payment. Buyers are responsible for providing correct shipping information. AuctaSync is not liable for lost, damaged, or delayed shipments."
    },
    {
      title: "7. Returns and Refunds",
      content: "If an item significantly differs from its description, buyers may request a return within 7 days of receipt. Final approval of returns is at AuctaSync's discretion. Refunds are processed within 14 days of approved returns."
    },
    {
      title: "8. Prohibited Items",
      content: "AuctaSync prohibits the sale of illegal items, counterfeit goods, hazardous materials, and items that infringe on intellectual property rights. Violations may result in account termination and legal action."
    },
    {
      title: "9. Account Termination",
      content: "AuctaSync reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or otherwise misuse the platform."
    },
    {
      title: "10. Modifications to Terms",
      content: "AuctaSync may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms. Users will be notified of significant changes."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a18] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Purple gradient bubble - top right */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500 rounded-full filter blur-[120px] opacity-20"></div>
        
        {/* Blue accent bubble - bottom left */}
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-[100px] opacity-20"></div>
        
        {/* Additional accent - mid right */}
        <div className="absolute top-[40%] right-[-5%] w-[300px] h-[300px] bg-purple-500 rounded-full filter blur-[80px] opacity-10"></div>
      </div>
      
      <BackButton />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Conditions</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Please read these terms carefully before using our auction platform.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Terms Content */}
      <section className="relative py-10 mb-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 mb-8">
                Last Updated: May 05, 2025
              </p>
              
              {termsSections.map((section, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
                    {section.title}
                  </h2>
                  <p className="text-gray-300">
                    {section.content}
                  </p>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: termsSections.length * 0.05 }}
                viewport={{ once: true }}
                className="mt-12 p-6 bg-gradient-to-br from-orange-500/10 to-purple-500/10 rounded-xl border border-white/10"
              >
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <p className="text-gray-300">
                  If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:legal@auctasync.com" className="text-orange-400 hover:text-orange-300 transition-colors">legal@auctasync.com</a>.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TermsPage;