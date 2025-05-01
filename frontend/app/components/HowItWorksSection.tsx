"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Register & Verify",
    description: "Create your account and complete verification to start bidding or listing items.",
    image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    number: "02",
    title: "Browse Auctions",
    description: "Explore active auctions or create your own listing with detailed descriptions and images.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1115&q=80",
  },
  {
    number: "03",
    title: "Bid & Win",
    description: "Place competitive bids on items you're interested in and track your status in real-time.",
    image: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80",
  },
  {
    number: "04",
    title: "Secure Payment",
    description: "Complete transactions securely through our protected payment gateway.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);
  
  useEffect(() => {
    const section = sectionRef.current;
    const stepElements = stepsRef.current;
    
    gsap.fromTo(
      section.querySelector('h2'),
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        }
      }
    );
    
    stepElements.forEach((step, index) => {
      gsap.fromTo(
        step,
        { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
          }
        }
      );
    });
  }, []);
  
  return (
    <section ref={sectionRef} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          How AuctaSync Works
        </h2>
        
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div 
              key={index}
              ref={el => stepsRef.current[index] = el}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
            >
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="text-8xl font-bold text-gray-100 dark:text-gray-700 absolute -top-10 -left-6 z-0">
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
