import React from 'react';

export const AnimatedBackground = () => {
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
