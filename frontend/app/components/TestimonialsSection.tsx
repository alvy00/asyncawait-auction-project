"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    content: "AuctaSync transformed our auction process. The real-time bidding feature created excitement and increased our final sale prices by 30%.",
    author: "Sarah Johnson",
    role: "Art Gallery Owner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
  },
  {
    id: 2,
    content: "As a collector, I've used many auction platforms, but AuctaSync stands out with its intuitive interface and secure payment system.",
    author: "Michael Chen",
    role: "Vintage Car Collector",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
  },
  {
    id: 3,
    content: "The analytics provided by AuctaSync helped us optimize our auction timing and starting bids, resulting in 40% higher engagement.",
    author: "Elena Rodriguez",
    role: "Estate Sale Manager",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=388&q=80",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-800 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
        
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-xl"
            >
              <div className="text-5xl text-orange-300 mb-6">`&quot;`</div>
              <p className="text-xl mb-8">{testimonials[current].content}</p>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-orange-300">
                  <Image 
                    src={testimonials[current].avatar} 
                    alt={testimonials[current].author}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{testimonials[current].author}</h4>
                  <p className="text-orange-300">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full ${current === index ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
