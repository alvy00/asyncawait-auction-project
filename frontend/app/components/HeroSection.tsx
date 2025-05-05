import Image from 'next/image';
import { Button } from '@frontend/components/ui/button';

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <Image 
          src="https://images.unsplash.com/photo-1514195037031-83d60ed3b448?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Auction Background" 
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-3xl backdrop-blur-sm bg-black/30 p-8 rounded-xl"> 
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg font-serif">
            Unlock Unbeatable Deals at AuctaSync
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white">
            Join 10,000+ trusted bidders. 100% money-back guarantee!
          </p>
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Auction Excellence</h3>
                <p className="text-white">Premium Quality Items</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L2 9.5l5 5a8.001 8.001 0 0014 0l5-5-.382-1.516z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Moneyback Guarantee</h3>
                <p className="text-white">100% Buyer Protection</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">24/7 Support</h3>
                <p className="text-white">Instant Customer Support</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 shadow-lg">
              Start Bidding Now
            </Button>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 border-0 shadow-lg">
              How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};