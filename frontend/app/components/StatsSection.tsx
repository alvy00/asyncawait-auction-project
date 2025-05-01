"use client";
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

const stats = [
  { label: "Active Users", value: 10000, suffix: "+" },
  { label: "Auctions Completed", value: 25000, suffix: "+" },
  { label: "Success Rate", value: 98, suffix: "%" },
  { label: "Average ROI", value: 27, suffix: "%" },
];

const StatsSection = () => {
  const countersRef = useRef([]);
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  useEffect(() => {
    if (inView) {
      countersRef.current.forEach((counter, index) => {
        const value = stats[index].value;
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: value,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            onUpdate: function() {
              counter.innerText = Math.ceil(this.targets()[0].innerText) + stats[index].suffix;
            }
          }
        );
      });
    }
  }, [inView]);
  
  return (
    <section ref={sectionRef} className="pb-20 pt-5 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <h3 
                ref={el => countersRef.current[index] = el}
                className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2"
              >
                0{stat.suffix}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
