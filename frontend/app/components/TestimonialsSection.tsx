"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    content: "AuctaSync made bidding so easy! I won a brand-new phone at half the price. Totally trustworthy.",
    author: "Weston Bennett",
    location: "USA",
    rating: 5,
    initials: "WB",
    bgColor: "#f0e68c", // Light yellow
  },
  {
    id: 2,
    content: "AuctaSync helped me win a vintage Rolex at a great price. Smooth process and fast delivery.",
    author: "John Miller",
    location: "UK",
    rating: 5,
    initials: "JM",
    bgColor: "#add8e6", // Light blue
  },
  {
    id: 3,
    content: "The UI is clean and intuitive. Got my MacBook through an exciting auction. Loved the experience!",
    author: "Carlos",
    location: "Spain",
    rating: 4,
    initials: "CA",
    bgColor: "#e6e6fa", // Light lavender
  },
  // Keep the rest of the testimonials but add initials and bgColor
  {
    id: 4,
    content: "Fantastic platform! I've been using it for months and never had any issues with payments or delivery.",
    author: "Emma Thompson",
    location: "Canada",
    rating: 5,
    initials: "ET",
    bgColor: "#ffc0cb", // Light pink
  },
  {
    id: 5,
    content: "The notification system is excellent. I never miss an auction ending thanks to the timely alerts.",
    author: "Hiroshi Tanaka",
    location: "Japan",
    rating: 4.5,
    initials: "HT",
    bgColor: "#98fb98", // Light green
  },
  {
    id: 6,
    content: "Customer service responded within minutes when I had a question. Very professional team!",
    author: "Sophie Laurent",
    location: "France",
    rating: 5,
    initials: "SL",
    bgColor: "#ffb6c1", // Light pink
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
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="50%" stopColor="#e5e7eb" />
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
          fill={i < rating ? "#FFA500" : "#e5e7eb"} 
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
    <section className="py-16 bg-[#0a0a18] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with left-aligned title and right-aligned navigation */}
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-3xl font-bold text-white">What Our Client Say?</h2>
          
          {/* Navigation buttons - positioned on the right side of the heading */}
          <div className="flex space-x-2">
            <button 
              onClick={prevTestimonial}
              className="bg-[#1a1a2e] hover:bg-[#2a2a3e] rounded-full p-2 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="bg-[#1a1a2e] hover:bg-[#2a2a3e] rounded-full p-2 transition-colors"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
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
                {getVisibleTestimonials().map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="relative flex-shrink-0 w-full max-w-xs z-20 mt-12"
                  >
                    {/* Avatar - positioned to be half over the card and half outside */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-20">
                      <div 
                        className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg flex items-center justify-center text-xl font-bold"
                        style={{ backgroundColor: testimonial.bgColor }}
                      >
                        {testimonial.initials}
                      </div>
                    </div>
                    
                    {/* Card content */}
                    <div className="bg-[#0f1729] rounded-xl overflow-hidden shadow-lg pt-14 pb-6 px-6 mt-10">
                      {/* Name and location */}
                      <div className="text-center mb-3">
                        <h3 className="text-white text-lg font-semibold">{testimonial.author}, {testimonial.location}</h3>
                        <div className="flex justify-center mt-1 mb-3">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      
                      {/* Testimonial content */}
                      <p className="text-white text-center text-sm">
                        {testimonial.content}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Testimonial indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? 'w-8 bg-white' : 'w-2 bg-white/30'
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
