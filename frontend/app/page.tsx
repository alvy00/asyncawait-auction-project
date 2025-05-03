"use client";
import { useEffect } from 'react';
import {Navbar} from './components/Navbar';
import {HeroSection} from './components/HeroSection';
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
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  useEffect(() => {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
  
  return (
    <>
      <main className="overflow-hidden">
        <Navbar />
        <Toaster position='top-center' reverseOrder={false}/>
        <HeroSection />
        <StatsSection />
        <TrustedPartners />
        <LimitedTimeOffer />
        <LiveAuctionsSection />
        <CategoryShowcase />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
