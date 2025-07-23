"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, StarHalf } from "lucide-react";
import { Bid } from "../../../lib/interfaces";

interface AuctionTabsProps {
  bidHistory: Bid[],
  reviews: {
    reviewer: {
      name: string;
      image: string;
    };
    date: string;
    rating: number;
    comment: string;
  }[];
}

const AuctionTabs = ({bidHistory, reviews }: AuctionTabsProps) => {
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="mt-12">
      <div className="border-b border-gray-800">
        <div className="flex gap-8">

          <button
            className={`pb-2 font-medium ${
              activeTab === "reviews"
                ? "border-b-2 border-[#ef863f] text-[#ef863f]"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={`pb-2 font-medium ${
              activeTab === "bids-history"
                ? "border-b-2 border-[#ef863f] text-[#ef863f]"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("bids-history")}
          >
            Bids History
          </button>
        </div>
      </div>

      <div className="mt-8">
        {/* Auction History Tab */}
        {activeTab === "bids-history" && (
          <div className="bg-[#010915] border border-gray-800 rounded-lg overflow-hidden">
            {bidHistory?.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left">Bidder</th>
                    <th className="px-4 py-3 text-left">Bid Amount</th>
                    <th className="px-4 py-3 text-left">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {bidHistory.map((bid, index) => (
                    <tr key={index} className="hover:bg-gray-900/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700" />
                          <span>{bid.user_id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">${bid.bid_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-400">{bid.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-400 py-12 text-sm">No bids yet. Be the first to place a bid!</div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="flex items-start gap-4 pb-6 border-b border-gray-800">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={review.reviewer.image}
                    alt="Reviewer"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{review.reviewer.name}</h3>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      if (star <= Math.floor(review.rating)) {
                        return <Star key={star} className="h-4 w-4 fill-[#ef863f] text-[#ef863f]" />;
                      } else if (star === Math.ceil(review.rating) && !Number.isInteger(review.rating)) {
                        return <StarHalf key={star} className="h-4 w-4 fill-[#ef863f] text-[#ef863f]" />;
                      } else {
                        return <Star key={star} className="h-4 w-4 text-gray-600" />;
                      }
                    })}
                    <span className="ml-2 text-sm text-gray-400">({review.rating.toFixed(1)})</span>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionTabs;