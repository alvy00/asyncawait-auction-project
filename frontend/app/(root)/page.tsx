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


export default function Home() {
  useEffect(() => {
    const hasPinged = sessionStorage.getItem('hasPingedServer');

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

    document.documentElement.style.scrollBehavior = 'smooth';
    document.head.appendChild(style);

    if (!hasPinged) {
      const coldStartBreak = async () => {
        try {
          const res = await fetch('https://asyncawait-auction-project.onrender.com/api/ping');
          const data = await res.json();
          console.log(data);
          sessionStorage.setItem('hasPingedServer', 'true');
        } catch (err) {
          console.error('Ping failed', err);
        }
      };
      coldStartBreak();
    }

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
        <CategoryShowcase />
        <AuctionTypesSection />
        <LiveAuctionsSection />
        <WhyChooseUsSection />
        <ConversionSection />
        {/* <CategorySection /> */}
        <NewsletterSection />
        <CTASection />
        <TestimonialsSection />
      </main>
    </>
  );
}
