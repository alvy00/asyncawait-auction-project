/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import TestimonialsSection from '../components/TestimonialsSection';
import LiveAuctionsSection from '../components/LiveAuctionsSection';
import CategoryShowcase from '../components/CategoryShowcase';
import CategorySection from '../components/CategorySection';
import { AuctionTypesSection } from '../components/auction-types/AuctionTypesSection';
import { WhyChooseUsSection } from '../components/WhyChooseUsSection';
import { CTASection } from '../components/CTASection';
import { ConversionSection } from '../components/ConversionSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { MarketingShowcase } from '../components/MarketingShowcase';


export default function Home() {

  // webapp start-up server warmup
  useEffect(() => {
    const hasPinged = sessionStorage.getItem('hasPingedServer');

    // Inject animation styles
    const style = document.createElement('style');
    style.innerHTML = `
      .animation-delay-1000 { animation-delay: 1s; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-3000 { animation-delay: 3s; }
      .animation-delay-4000 { animation-delay: 4s; }

      @keyframes blob {
        0%   { transform: translate(0px, 0px) scale(1); }
        33%  { transform: translate(30px, -50px) scale(1.1); }
        66%  { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }

      .animate-blob { animation: blob 25s infinite; }
    `;
    document.head.appendChild(style);

    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Cold-start ping
    if (!hasPinged) {
      (async () => {
        try {
          const ping = await fetch('https://asyncawait-auction-project.onrender.com/api/ping');
          const maintenance = await fetch('https://asyncawait-auction-project.onrender.com/api/maintenance');

          sessionStorage.setItem('hasPingedServer', 'true');
        } catch (err) {
          console.error('Server cold start or maintenance ping failed:', err);
        }
      })();
    }

    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = '';
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  
  return (
    <>
      <main className="relative overflow-hidden text-white">
        {/* <AnimatedBackground /> */}
        <HeroSection />
        {/* <CategoryShowcase /> */}
        <LiveAuctionsSection />
        <AuctionTypesSection />
        <WhyChooseUsSection />
        <MarketingShowcase />
        {/* <CategorySection /> */}
        <TestimonialsSection />
        <NewsletterSection />
        {/* <ConversionSection /> */}
        {/* <CTASection /> */}
      </main>
    </>
  );
}
