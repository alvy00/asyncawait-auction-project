"use client";

import { useState, useEffect } from "react";
import AuctionCard from "../AuctionCard";
import { Auction } from "../../../lib/interfaces";
import { motion } from "framer-motion";

interface RelatedProductsProps {
  currentAuctionId: string;
  category?: string;
}

const RelatedProducts = ({ currentAuctionId, category }: RelatedProductsProps) => {
  const [relatedAuctions, setRelatedAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRelatedAuctions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          "https://asyncawait-auction-project.onrender.com/api/auctions",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch related auctions");
          return;
        }

        const data = await res.json();
        
        // Filter out current auction and get related by category if available
        let filtered = data.filter((auction: Auction) => 
          auction.auction_id !== currentAuctionId
        );
        
        if (category) {
          const categoryFiltered = filtered.filter((auction: Auction) => 
            auction.category === category
          );
          
          // If we have enough category-specific auctions, use those
          if (categoryFiltered.length >= 4) {
            filtered = categoryFiltered;
          }
        }
        
        // Limit to 4 related products
        setRelatedAuctions(filtered.slice(0, 4));
        
        // Initialize favorites map
        const initialFavs: Record<string, boolean> = {};
        filtered.slice(0, 4).forEach((auction: Auction) => {
          initialFavs[auction.auction_id] = false;
        });
        setFavoritesMap(initialFavs);
        
      } catch (e) {
        console.error("Error fetching related auctions:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedAuctions();
  }, [currentAuctionId, category]);

  const handleToggleFavorite = (auctionId: string) => {
    setFavoritesMap(prev => ({
      ...prev,
      [auctionId]: !prev[auctionId]
    }));
  };

  if (isLoading || relatedAuctions.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedAuctions.map((auction) => (
          <motion.div
            key={auction.auction_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AuctionCard
              auction={auction}
              auctionCreator={auction.creator || "Anonymous"}
              isFavourited={favoritesMap[auction.auction_id]}
              onToggleFavorite={() => handleToggleFavorite(auction.auction_id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;