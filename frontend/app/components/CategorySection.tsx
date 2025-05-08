"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  itemCount: number;
  image: string;
}

const categories: Category[] = [
  {
    id: 'cars',
    name: 'Cars',
    itemCount: 9,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500&auto=format&fit=crop',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    id: 'gadget',
    name: 'Gadget',
    itemCount: 50,
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=500&auto=format&fit=crop',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'antiques',
    name: 'Antiques',
    itemCount: 61,
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=500&auto=format&fit=crop',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
  },
  {
    id: 'furniture',
    name: 'Furniture',
    itemCount: 30,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500&auto=format&fit=crop',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'jewellery',
    name: 'Jewellery',
    itemCount: 110,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=500&auto=format&fit=crop',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'fashion',
    name: 'Fashion',
    itemCount: 200,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=500&auto=format&fit=crop',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#0a0a18] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold"
          >
            Browse By Category
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * categories.indexOf(category) }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <Link href={`/category/${category.id}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col">
                  {/* Icon at the top */}
                  <div className="flex justify-center pt-4 pb-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-700">
                        {category.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Name and Count */}
                  <div className="text-center px-4 pb-2">
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-gray-500 text-sm">{category.itemCount} items</p>
                  </div>
                  
                  {/* Image */}
                  <div className="mt-auto">
                    <div className="relative aspect-square">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Link 
            href="/categories"
            className="flex items-center text-white hover:text-gray-300 font-medium text-sm transition-all duration-300"
          >
            <span>View All Categories</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;