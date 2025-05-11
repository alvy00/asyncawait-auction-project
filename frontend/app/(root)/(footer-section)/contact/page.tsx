"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  // Contact information
  const contactInfo = [
    {
      icon: <FiMail className="h-6 w-6" />,
      title: "Email Us",
      details: "auctasync@gmail.com",
      description: "Our team typically responds within 24 hours"
    },
    {
      icon: <FiPhone className="h-6 w-6" />,
      title: "Call Us",
      details: "+007007007007",
      description: "Available Monday-Friday, 9AM-6PM"
    },
    {
      icon: <FiMapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: "123 Auction-pur, Dhaka",
      description: "Our headquarters is open for scheduled appointments"
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#0a0a18] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Purple gradient bubble - top right */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500 rounded-full filter blur-[120px] opacity-20"></div>
        
        {/* Orange accent bubble - bottom left */}
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-orange-500 rounded-full filter blur-[100px] opacity-20"></div>
        
        {/* Additional accent - mid right */}
        <div className="absolute top-[40%] right-[-5%] w-[300px] h-[300px] bg-blue-500 rounded-full filter blur-[80px] opacity-10"></div>
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
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Have questions about our auction platform? Our team is here to help you.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Info Cards */}
      <section className="relative py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-xl"
              >
                <div className="mb-6 p-3 bg-purple-500/20 rounded-full w-fit">
                  {info.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{info.title}</h3>
                <p className="text-purple-300 font-medium mb-2">{info.details}</p>
                <p className="text-gray-400">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form & Map Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <div className="flex items-center p-4 mb-6 text-green-400 bg-green-400/10 rounded-lg">
                    <FiCheck className="w-5 h-5 mr-2" />
                    <span>Your message has been sent successfully!</span>
                  </div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-300 mb-2">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    >
                      <option value="" disabled className="bg-[#1a1a2e]">Select a subject</option>
                      <option value="general" className="bg-[#1a1a2e]">General Inquiry</option>
                      <option value="support" className="bg-[#1a1a2e]">Technical Support</option>
                      <option value="billing" className="bg-[#1a1a2e]">Billing Question</option>
                      <option value="partnership" className="bg-[#1a1a2e]">Partnership Opportunity</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-300 mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-lg text-white font-bold flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FiSend className="mr-2" /> Send Message
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
            
            {/* Map */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="h-full bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/10 shadow-xl overflow-hidden">
                <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden">
                  {/* Replace with actual map component if available */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1333&q=80" 
                    alt="Map location" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 z-20">
                    <h3 className="text-xl font-bold mb-2">AuctaSync Headquarters</h3>
                    <p className="text-gray-300">123 Auction Avenue, New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/10 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Have More Questions?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Check our comprehensive FAQ section for quick answers to common questions.
            </p>
            <a 
              href="/how-it-works"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-lg text-lg transition-all duration-300 hover:scale-105 inline-block"
            >
              View FAQs
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;