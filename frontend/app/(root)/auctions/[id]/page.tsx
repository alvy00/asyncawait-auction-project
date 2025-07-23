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
  const [ bidsHistory, setBidsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [endTime, setEndTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateCountdown = (endDateInput: string | number) => {
    let endDateMs: number;

    if (typeof endDateInput === "number") {
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

  // fetch auction details
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      setIsLoading(true);
      try {
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

  // fetch bids history
  useEffect(() => {
    const fetchTopBids = async () => {
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/topbids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ auction_id: auction?.auction_id }),
        });

        if (!res.ok) {
          console.error("Failed to fetch top bids:", res.status);
          return;
        }

        const data = await res.json();
        setBidsHistory(data);
        console.log(data)
      } catch (e) {
        console.error("Error fetching top bids:", e);
      }
    };

    if (auction?.auction_id) {
      fetchTopBids();
    }
  }, [auction?.auction_id]);

  useEffect(() => {
    if (!auction?.end_time) return;
    if (isNaN(new Date(auction.end_time).getTime())) return;

    setEndTime(calculateCountdown(auction.end_time));

    const interval = setInterval(() => {
      setEndTime(calculateCountdown(auction.end_time));
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  // dummy place bid
  const handleBid = (amount: number) => {
    toast.success(`Bid of $${amount.toFixed(2)} placed successfully!`);
  };

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
    endTime,
  };

  const reviews = [
    {
      reviewer: {
        name: "Isabella Nguyen",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=48&auto=format&fit=crop",
      },
      date: "July 19, 2025",
      rating: 4.8,
      comment:
        "Great auction! The seller was very responsive and the item arrived exactly as described. I love the packaging and attention to detail.",
    },
    {
      reviewer: {
        name: "Liam Patel",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=48&auto=format&fit=crop",
      },
      date: "July 14, 2025",
      rating: 5.0,
      comment:
        "One of the smoothest bidding experiences I've had. Fast shipping, high-quality product, and the auction UI is top-notch. Definitely coming back!",
    },
    {
      reviewer: {
        name: "Sophia Rodriguez",
        image:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=48&auto=format&fit=crop",
      },
      date: "July 10, 2025",
      rating: 4.2,
      comment:
        "The item was excellent and arrived on time, though I wish there was more transparency around the bidder history. Otherwise, 10/10 experience.",
    },
    {
      reviewer: {
        name: "Ethan Kim",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=48&auto=format&fit=crop",
      },
      date: "July 8, 2025",
      rating: 4.7,
      comment:
        "Fantastic seller! Item matched the description perfectly. Loved the Phantom auction type—adds mystery and excitement to bidding.",
    },
    {
      reviewer: {
        name: "Chloe Anderson",
        image:
          "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=48&auto=format&fit=crop",
      },
      date: "July 2, 2025",
      rating: 5.0,
      comment:
        "Absolutely thrilled with my win. Packaging was premium, and the communication was excellent. Highly recommend this platform!",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a2b] to-[#001021] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ef863f]"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a2b] to-[#001021] text-white flex items-center justify-center">
        <p className="text-lg">Auction not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1a2b] to-[#001021] text-white pt-20 pb-20">
      <main className="container mx-auto px-6 max-w-6xl">
        {/* Image gallery full width with fixed aspect ratio */}
        <div
          className="
            rounded-3xl
            overflow-hidden
            border border-white/30
            shadow-lg
            backdrop-blur-lg
            bg-black/20
            mb-10
            relative
            aspect-[16/9]
          "
        >
          <ImageGallery images={auction.images} productName={auctionDetails.title} />
        </div>

        {/* Details and bidding stacked vertically */}
        <div
          className="
            backdrop-blur-lg
            bg-black/20
            border border-white/30
            rounded-3xl
            shadow-lg
            p-8
            flex
            flex-col
            gap-8
          "
        >
          <div>
            <AuctionDetails {...auctionDetails} />
          </div>

          <div>
            <BiddingSection currentBid={auctionDetails.currentBid} onBid={handleBid} />
          </div>
        </div>

        {/* Tabs section */}
        <div
          className="
            backdrop-blur-lg
            bg-black/20
            border border-white/30
            rounded-3xl
            shadow-lg
            p-6
            mt-10
          "
        >
          <AuctionTabs auctionHistory={bidsHistory} reviews={reviews} />
        </div>

        {/* Related products */}
        <div
          className="
            backdrop-blur-lg
            bg-black/20
            border border-white/30
            rounded-3xl
            shadow-lg
            p-6
            mt-8
            mb-10
          "
        >
          <RelatedProducts currentAuctionId={auctionId} category={auction?.category} />
        </div>
      </main>
    </div>
  );
}
