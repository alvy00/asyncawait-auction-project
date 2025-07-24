"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const HowItWorksPage = () => {
  // Steps for the auction process
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up for free and set up your profile to start your auction journey with AuctaSync.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      image: "/register.png",
      imageAlt: "Person signing up on laptop"
    },
    {
      number: "02",
      title: "Browse Auctions",
      description: "Explore our wide range of premium items across various categories to find what interests you.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      image: "/browse.png",
      imageAlt: "Person browsing items on tablet"
    },
    {
      number: "03",
      title: "Place Your Bid",
      description: "Set your maximum bid amount and let our system automatically bid for you up to your limit.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      image: "/bid.png",
      imageAlt: "Person raising hand to bid at auction"
    },
    {
      number: "04",
      title: "Win & Collect",
      description: "If you're the highest bidder when the auction ends, complete your payment and arrange delivery.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      imageAlt: "Person receiving package delivery"
    }
  ];

  // FAQ items
  const faqs = [
    {
      question: "How do I register for an auction?",
      answer: "Registration is simple! Click the 'Sign Up' button, fill in your details, verify your email, and you're ready to start bidding on items."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and selected cryptocurrencies for secure and convenient transactions."
    },
    {
      question: "How is shipping handled?",
      answer: "Shipping costs are calculated based on your location and the item size. We work with trusted logistics partners to ensure safe delivery."
    },
    {
      question: "What if I win multiple auctions?",
      answer: "You can combine shipping for multiple won items to save on costs. Just contact our support team to arrange this."
    },
    {
      question: "Can I cancel a bid once placed?",
      answer: "Under special circumstances, our team may review bid cancellation requests. Please contact support immediately if needed."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a18] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Orange/red gradient bubble - top right */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500 rounded-full filter blur-[120px] opacity-20"></div>
        
        {/* Dark accent bubble - bottom left */}
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-gray-800 rounded-full filter blur-[100px] opacity-30"></div>
        
        {/* Additional accent - mid left */}
        <div className="absolute top-[40%] left-[-5%] w-[300px] h-[300px] bg-purple-500 rounded-full filter blur-[80px] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">AuctaSync</span> Works
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Our streamlined auction process makes buying and selling premium items simple, secure, and exciting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-32">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                {/* Text Content */}
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="text-8xl font-bold text-white opacity-10 absolute -top-10 -left-6 z-0">
                      {step.number}
                    </div>
                    <div className="relative z-10 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
                      <div className="mb-6 p-3 bg-orange-500/20 rounded-full w-fit">
                        {step.icon}
                      </div>
                      <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                      <p className="text-xl text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Image */}
                <div className="lg:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <div className="aspect-video relative">
                      {/* Use Unsplash images */}
                      <Image 
                        src={step.image}
                        alt={step.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 group-hover:opacity-70 transition-opacity duration-500"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 bg-[#0c0c20]">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about our auction platform
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300 shadow-lg">
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/10 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Bidding?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of collectors and enthusiasts on AuctaSync today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg text-lg transition-all duration-300 hover:scale-105">
                  Create Account
                </button>
              </Link>
              <Link href="/auctions">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-lg text-lg transition-all duration-300 hover:scale-105">
                  Browse Auctions
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;