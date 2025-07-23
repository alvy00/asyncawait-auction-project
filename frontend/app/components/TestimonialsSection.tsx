"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "AuctaSync made bidding so easy! I won a brand-new phone at half the price. Totally trustworthy.",
    author: "Weston Bennett",
    location: "USA",
    rating: 5,
    initials: "WB",
    bgColor: "#f0e68c",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
  {
    id: 2,
    content: "AuctaSync helped me win a vintage Rolex at a great price. Smooth process and fast delivery.",
    author: "John Miller",
    location: "UK",
    rating: 5,
    initials: "JM",
    bgColor: "#add8e6",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
  {
    id: 3,
    content: "The UI is clean and intuitive. Got my MacBook through an exciting auction. Loved the experience!",
    author: "Carlos Rodriguez",
    location: "Spain",
    rating: 4,
    initials: "CA",
    bgColor: "#e6e6fa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
  {
    id: 4,
    content: "Fantastic platform! I've been using it for months and never had any issues with payments or delivery.",
    author: "Emma Thompson",
    location: "Canada",
    rating: 5,
    initials: "ET",
    bgColor: "#ffc0cb",
    avatar: "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 5,
    content: "The notification system is excellent. I never miss an auction ending thanks to the timely alerts.",
    author: "Hiroshi Tanaka",
    location: "Japan",
    rating: 4.5,
    initials: "HT",
    bgColor: "#98fb98",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
  {
    id: 6,
    content: "Customer service responded within minutes when I had a question. Very professional team!",
    author: "Sophie Laurent",
    location: "France",
    rating: 5,
    initials: "SL",
    bgColor: "#ffb6c1",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate the number of visible cards and total pages
  const visibleCards = 3;
  const totalPages = Math.ceil(testimonials.length / visibleCards);
  
  const nextTestimonial = () => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % totalPages);
  };
  
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + totalPages) % totalPages);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => {
      // For half stars
      if (i < Math.floor(rating) && i + 1 > rating) {
        return (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
            <defs>
              <linearGradient id={`halfStar-${i}`}>
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path 
              fillRule="evenodd" 
              fill={`url(#halfStar-${i})`}
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
              clipRule="evenodd" 
            />
          </svg>
        );
      }
      
      return (
        <svg 
          key={i} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={i < rating ? "#F59E0B" : "#374151"} 
          className="w-4 h-4"
        >
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      );
    });
  };
  
  // Get current visible testimonials
  const getVisibleTestimonials = () => {
    const startIndex = current * visibleCards;
    return testimonials.slice(startIndex, startIndex + visibleCards);
  };
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Add consistent background */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1419] via-[#1a202c] to-[#2d3748]" />
        <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[10%] right-[-15%] w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-[60%] left-[70%] w-[200px] h-[200px] bg-blue-500/8 rounded-full blur-[80px] animate-float-delayed" />
      </div> */}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with left-aligned title and right-aligned navigation */}
        <div className="flex justify-center items-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Clients</span> Say?
          </motion.h2>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Testimonials container */}
          <div 
            ref={containerRef}
            className="relative overflow-hidden mt-12"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                initial={{ 
                  opacity: 0, 
                  x: direction > 0 ? 100 : -100 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                }}
                exit={{ 
                  opacity: 0, 
                  x: direction > 0 ? -100 : 100,
                }}
                transition={{ duration: 0.5 }}
                className="flex justify-center gap-6 md:gap-8"
              >
                {getVisibleTestimonials().map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    className="relative flex-shrink-0 w-full max-w-xs z-20 mt-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Avatar - positioned to be half over the card and half outside */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-20">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-orange-400/20 to-purple-600/20 backdrop-blur-sm">
                          <Image 
                            src={testimonial.avatar} 
                            alt={testimonial.author} 
                            width={96} 
                            height={96} 
                            className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/30 to-purple-600/30 blur-xl -z-10"></div>
                      </div>
                    </div>
                    
                    {/* Card content */}
                    <div className="relative bg-gradient-to-br from-[#1a2332]/80 to-[#0f1729]/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl pt-16 pb-8 px-8 mt-12 border border-white/10 hover:border-orange-400/30 transition-all duration-300 group">
                      {/* Background decoration */}
                      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                        <Quote className="w-8 h-8 text-orange-400" />
                      </div>
                      
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Name and location */}
                      <div className="text-center mb-4 relative z-10">
                        <h3 className="text-white text-lg font-semibold mb-1">
                          {testimonial.author}
                        </h3>
                        <p className="text-orange-400/80 text-sm font-medium">
                          {testimonial.location}
                        </p>
                        <div className="flex justify-center mt-2 mb-4">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      
                      {/* Testimonial content */}
                      <div className="relative z-10">
                        <p className="text-gray-300 text-center text-sm leading-relaxed">
                          "{testimonial.content}"
                        </p>
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-orange-400 to-purple-600 rounded-full opacity-60 group-hover:opacity-100 group-hover:w-24 transition-all duration-300"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Testimonial indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 hover:bg-orange-400/60 ${
                  index === current 
                    ? 'w-8 bg-gradient-to-r from-orange-400 to-orange-600' 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
