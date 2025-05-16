"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="flex">
      {/* Thumbnails */}
      <div className="hidden md:flex flex-col gap-2 mr-2">
        {images.map((src, index) => (
          <div
            key={index}
            className={`w-20 h-20 overflow-hidden rounded border cursor-pointer transition-all ${
              currentImageIndex === index ? "border-[#ef863f]" : "border-gray-700 hover:border-gray-500"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`Thumbnail ${index}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 rounded overflow-hidden border border-gray-700">
        <Image
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={productName}
          width={600}
          height={600}
          className="w-full h-auto"
        />
        <button className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full">
          <ZoomIn className="h-5 w-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
          <div className="flex gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  currentImageIndex === index ? "bg-white" : "bg-gray-500"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;