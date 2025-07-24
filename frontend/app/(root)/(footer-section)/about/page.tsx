"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { AnimatedBackground } from '../../../components/AnimatedBackground';
import { 
  Users, 
  Target, 
  Shield, 
  Award, 
  Heart, 
  Zap, 
  Globe, 
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';
import Image from 'next/image';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const stats = [
    { number: "10K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "50K+", label: "Auctions Completed", icon: <Award className="w-6 h-6" /> },
    { number: "99.9%", label: "Success Rate", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "24/7", label: "Customer Support", icon: <Shield className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Security",
      description: "We prioritize the security of every transaction with advanced encryption and fraud protection."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "User-Centric",
      description: "Every feature is designed with our users in mind, ensuring the best possible auction experience."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description: "We continuously innovate to bring cutting-edge auction technology to our platform."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Connecting bidders and sellers worldwide through our seamless auction platform."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b412?w=300&h=300&fit=crop&crop=face&auto=format&q=80",
      description: "Visionary leader with 15+ years in fintech and e-commerce."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&auto=format&q=80",
      description: "Tech innovator specializing in blockchain and auction systems."
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&auto=format&q=80",
      description: "Award-winning designer focused on user experience and accessibility."
    }
  ];

  return (
    <div className="min-h-screen bg-[#040c16] text-white relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/12 rounded-full blur-[100px] animate-float" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              About AuctaSync
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Revolutionizing the auction experience through cutting-edge technology, 
              transparent processes, and unwavering commitment to our community.
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-orange-400/50 transition-all duration-300 group"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-center mb-3 text-orange-400 group-hover:text-orange-300 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a202c]/30 to-transparent" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-orange-400" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                To democratize the auction process by providing a secure, transparent, and 
                user-friendly platform that connects buyers and sellers globally. We believe 
                everyone should have access to fair and exciting auction experiences.
              </p>
              <div className="flex items-center gap-2 text-orange-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Empowering Global Commerce</span>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                To become the world's most trusted auction platform, setting new standards 
                for innovation, security, and user experience. We envision a future where 
                auctions are accessible, transparent, and beneficial for all participants.
              </p>
              <div className="flex items-center gap-2 text-purple-400">
                <Globe className="w-5 h-5" />
                <span className="font-semibold">Shaping the Future of Auctions</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-green-500/8 rounded-full blur-[80px] animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Values</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-orange-400/50 transition-all duration-300 group text-center"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="flex justify-center mb-4 text-orange-400 group-hover:text-orange-300 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The passionate individuals behind AuctaSync's success
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-purple-400/50 transition-all duration-300 group"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/30 to-purple-600/30 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="relative w-full h-full object-cover rounded-full border-4 border-white/20 group-hover:border-purple-400/50 transition-all duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-orange-400 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10" />
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-600">Revolution?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the future of auctions with AuctaSync. Start bidding or selling today!
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Bidding Now
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Auction
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;