"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

const partners = [
  {
    name: "Forbes",
    logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Forbes Logo"
  },
  {
    name: "TechCrunch",
    logo: "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "TechCrunch Logo"
  },
  {
    name: "Business Insider",
    logo: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Business Insider Logo"
  },
  {
    name: "Bloomberg",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Bloomberg Logo"
  },
  {
    name: "Wall Street Journal",
    logo: "https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "WSJ Logo"
  },
  {
    name: "CNBC",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "CNBC Logo"
  },
];

const TrustedPartners = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300">Trusted by Industry Leaders</h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              <div className="h-12 w-24 relative">
                <Image 
                  src={partner.logo} 
                  alt={partner.alt}
                  width={96}
                  height={48}
                  className="object-contain"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedPartners;