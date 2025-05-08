"use client";
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import StatsSection from './components/StatsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import LiveAuctionsSection from './components/LiveAuctionsSection';
import TrustedPartners from './components/TrustedPartners';
import LimitedTimeOffer from './components/LimitedTimeOffer';
import CategoryShowcase from './components/CategoryShowcase';
import CategorySection from './components/CategorySection';

// Animated Gradient Bubbles Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Orange/red gradient bubble - top right */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500 rounded-full filter blur-[80px] opacity-30 animate-blob"></div>
      
      {/* Smaller orange accent - mid right */}
      <div className="absolute top-[30%] right-[-5%] w-[300px] h-[300px] bg-orange-400 rounded-full filter blur-[60px] opacity-20 animate-blob animation-delay-2000"></div>
      
      {/* Dark accent bubble - bottom left */}
      <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-gray-800 rounded-full filter blur-[70px] opacity-50 animate-blob animation-delay-4000"></div>
      
      {/* Orange accent - bottom right */}
      <div className="absolute bottom-[5%] right-[20%] w-[350px] h-[350px] bg-orange-600 rounded-full filter blur-[70px] opacity-20 animate-blob animation-delay-3000"></div>
    </div>
  );
};

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
      <main className="relative overflow-hidden bg-[#0A111B] text-white">
        <AnimatedBackground />
        <Navbar />
        <HeroSection />
        <CategoryShowcase />
        <LiveAuctionsSection />
        <CategorySection />
        <TestimonialsSection />
        <Footer />
      </main>
    </>
  );
}
