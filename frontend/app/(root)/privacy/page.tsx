"use client";

import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '../../components/BackButton';

const PrivacyPolicyPage = () => {
  // Privacy policy sections data
  const policySections = [
    {
      title: "1. Information We Collect",
      content: "We collect personal information when you register an account, including your name, email address, phone number, and payment information. We also collect information about your bidding activity, browsing behavior, and device information when you use our platform."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use your information to process transactions, manage your account, provide customer support, and improve our services. We may also use your information to send you updates about auctions, personalized recommendations, and marketing communications."
    },
    {
      title: "3. Information Sharing",
      content: "We share your information with sellers when you win an auction to facilitate shipping and delivery. We may also share your information with payment processors, service providers, and legal authorities when required by law. We do not sell your personal information to third parties."
    },
    {
      title: "4. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure."
    },
    {
      title: "5. Cookies and Tracking Technologies",
      content: "We use cookies and similar tracking technologies to enhance your experience on our platform, analyze usage patterns, and deliver personalized content. You can control cookie settings through your browser preferences."
    },
    {
      title: "6. Your Privacy Rights",
      content: "Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal information. You may also have the right to data portability and to withdraw consent for certain processing activities."
    },
    {
      title: "7. Children's Privacy",
      content: "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information."
    },
    {
      title: "8. International Data Transfers",
      content: "Your personal information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information during such transfers."
    },
    {
      title: "9. Changes to This Privacy Policy",
      content: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes through the platform or by email."
    },
    {
      title: "10. Data Retention",
      content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a18] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Orange gradient bubble - top right */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500 rounded-full filter blur-[120px] opacity-20"></div>
        
        {/* Purple accent bubble - bottom left */}
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-purple-500 rounded-full filter blur-[100px] opacity-20"></div>
        
        {/* Additional accent - mid left */}
        <div className="absolute top-[40%] left-[-5%] w-[300px] h-[300px] bg-blue-500 rounded-full filter blur-[80px] opacity-10"></div>
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
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Policy</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your data.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Privacy Policy Content */}
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
                Effective Date: May 05, 2025
              </p>
              
              <div className="mb-8 p-6 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-xl border border-white/10">
                <p className="text-white">
                  At AuctaSync, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our auction platform.
                </p>
              </div>
              
              {policySections.map((section, index) => (
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
                transition={{ duration: 0.5, delay: policySections.length * 0.05 }}
                viewport={{ once: true }}
                className="mt-12 p-6 bg-gradient-to-br from-orange-500/10 to-purple-500/10 rounded-xl border border-white/10"
              >
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <p className="text-gray-300">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer at <a href="mailto:privacy@auctasync.com" className="text-orange-400 hover:text-orange-300 transition-colors">privacy@auctasync.com</a>.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (policySections.length + 1) * 0.05 }}
                viewport={{ once: true }}
                className="mt-8 text-center"
              >
                <p className="text-gray-400 text-sm">
                  By using AuctaSync, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy.
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

export default PrivacyPolicyPage;