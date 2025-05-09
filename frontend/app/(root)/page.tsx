/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import TestimonialsSection from '../components/TestimonialsSection';
import StatsSection from '../components/StatsSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import LiveAuctionsSection from '../components/LiveAuctionsSection';
import TrustedPartners from '../components/TrustedPartners';
import LimitedTimeOffer from '../components/LimitedTimeOffer';
import CategoryShowcase from '../components/CategoryShowcase';
import CategorySection from '../components/CategorySection';
import { AnimatedBackground } from '../components/AnimatedBackground';

// Animated Gradient Bubbles Component

export default function Home() {
  useEffect(() => {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add animation delay classes and keyframes directly to the document
    const style = document.createElement('style');
    style.innerHTML = `
      .animation-delay-1000 {
        animation-delay: 1s;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-3000 {
        animation-delay: 3s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      @keyframes blob {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
      .animate-blob {
        animation: blob 25s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <>
      <main className="relative overflow-hidden bg-[#0a0a18] text-white">
        {/* <AnimatedBackground /> */}
        <HeroSection />
        <CategoryShowcase />
        <LiveAuctionsSection />
        <CategorySection />
        <TestimonialsSection />
      </main>
    </>
  );
}
