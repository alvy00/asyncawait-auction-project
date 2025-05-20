"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Auction } from "../../../../lib/interfaces";
import ImageGallery from "../../../components/auction-detail/ImageGallery";
import AuctionDetails from "../../../components/auction-detail/AuctionDetails";
import BiddingSection from "../../../components/auction-detail/BiddingSection";
import AuctionTabs from "../../../components/auction-detail/AuctionTabs";
import RelatedProducts from "../../../components/auction-detail/RelatedProducts";
import toast from "react-hot-toast";

export default function AuctionDetailPage() {
  const params = useParams();
  const auctionId = params.id as string;

  const [auction, setAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Countdown state
  const [endTime, setEndTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate countdown helper - handles string or number timestamps
  const calculateCountdown = (endDateInput: string | number) => {
    let endDateMs: number;

    if (typeof endDateInput === "number") {
      // Convert seconds to milliseconds if needed
      endDateMs = endDateInput < 1e12 ? endDateInput * 1000 : endDateInput;
    } else {
      endDateMs = new Date(endDateInput).getTime();
    }

    const now = Date.now();
    const diff = endDateMs - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  // Fetch auction data
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      setIsLoading(true);
      try {
        // https://asyncawait-auction-project.onrender.com/api/auctions/:id
        // http://localhost:8000/api/auctions/${auctionId}
        const res = await fetch(`https://asyncawait-auction-project.onrender.com/api/auctions/${auctionId}`, {
          method: "GET",
          headers: { "Content-type": "application/json" },
        });

        if (!res.ok) {
          console.error("Failed to fetch auction details");
          return;
        }

        const data = await res.json();
        setAuction(data);
      } catch (e) {
        console.error("Error fetching auction details:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (auctionId) {
      fetchAuctionDetails();
    }
  }, [auctionId]);

  // Update countdown every second once auction is loaded
  useEffect(() => {
    if (!auction?.end_time) return;

    // Defensive check for valid date
    if (isNaN(new Date(auction.end_time).getTime())) return;

    // Initial countdown set
    setEndTime(calculateCountdown(auction.end_time));

    const interval = setInterval(() => {
      setEndTime(calculateCountdown(auction.end_time));
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  // Handle bidding
  const handleBid = (amount: number) => {
    const token =
      localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");

    if (!token) {
      toast.error("Please log in to place a bid");
      return;
    }

    // Implement bid submission logic here
    toast.success(`Bid of $${amount.toFixed(2)} placed successfully!`);
  };

  // Prepare auction details object with fallback handling
  const auctionDetails = {
    seller: {
      name: auction?.creator ?? "Unknown Seller",
      image: "/fallback_user_avatar.png",
    },
    title: auction?.item_name ?? "No Title",
    description: auction?.description ?? "No description available",
    currentBid: auction?.highest_bid ?? 0,
    startingBid: auction?.starting_price ?? 0,
    condition: auction?.condition?.toUpperCase() ?? "N/A",
    categories: auction?.category?.toUpperCase() ?? "N/A",
    endTime, // dynamic countdown here
  };

  // Static auction history and reviews (unchanged)
  const auctionHistory = [
    {
      bidder: {
        name: "Michael Johnson",
        image:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=32&auto=format&fit=crop",
      },
      amount: 305.0,
      date: "May 14, 2025 - 10:45 AM",
      status: "current" as const,
    },
    {
      bidder: {
        name: "Sarah Williams",
        image:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=32&auto=format&fit=crop",
      },
      amount: 300.0,
      date: "May 13, 2025 - 3:22 PM",
      status: "outbid" as const,
    },
    {
      bidder: {
        name: "Robert Chen",
        image:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=32&auto=format&fit=crop",
      },
      amount: 285.0,
      date: "May 12, 2025 - 9:15 AM",
      status: "outbid" as const,
    },
    {
      bidder: {
        name: "Amanda Parker",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=32&auto=format&fit=crop",
      },
      amount: 270.0,
      date: "May 10, 2025 - 5:30 PM",
      status: "outbid" as const,
    },
  ];

  const reviews = [
    {
      reviewer: {
        name: "James Wilson",
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=48&auto=format&fit=crop",
      },
      date: "May 2, 2025",
      rating: 5.0,
      comment:
        "Absolutely stunning edition! The gold detailing is exquisite and the quality of the binding is exceptional. Eleanor was very helpful and the item arrived in perfect condition, exactly as described. A true collector's dream!",
    },
    {
      reviewer: {
        name: "Thomas Reynolds",
        image:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=48&auto=format&fit=crop",
      },
      date: "April 15, 2025",
      rating: 4.5,
      comment:
        "I've been collecting Harry Potter editions for years, and this is one of the finest I've seen. The annotations from J.K. Rowling add incredible value to an already beautiful piece. Shipping was a bit slow, but the quality makes up for it.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#021f49] to-[#010915] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ef863f]"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#021f49] to-[#010915] text-white flex items-center justify-center">
        <p className="text-lg">Auction not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021f49] to-[#010915] text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Product Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Thumbnails and Main Image */}
          <div className="lg:col-span-6">
            <ImageGallery images={auction.images} productName={auctionDetails.title} />
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-6">
            <AuctionDetails {...auctionDetails} />
            <BiddingSection currentBid={auctionDetails.currentBid} onBid={handleBid} />
          </div>
        </div>

        {/* Tabs Section */}
        <AuctionTabs
          description={auctionDetails.description}
          auctionHistory={auctionHistory}
          reviews={reviews}
        />

        {/* Related Products Section */}
        <RelatedProducts currentAuctionId={auctionId} category={auction?.category} />
      </main>
    </div>
  );
}
