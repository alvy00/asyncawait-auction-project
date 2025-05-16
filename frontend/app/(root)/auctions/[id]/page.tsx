"use client"

import { useState, useEffect } from "react"
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
  
  // Fetch auction data
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://asyncawait-auction-project.onrender.com/api/auctions/${auctionId}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );

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

  // Handle bidding
  const handleBid = (amount: number) => {
    const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
    
    if (!token) {
      toast.error("Please log in to place a bid");
      return;
    }
    
    // Implement bid submission logic here
    toast.success(`Bid of $${amount.toFixed(2)} placed successfully!`);
  };

  // For demo purposes, using placeholder data if API fetch fails
  const productImages = auction?.images || [
    "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=600&auto=format&fit=crop",
  ];

  // Sample data for demo purposes
  const auctionDetails = {
    seller: {
      name: auction?.creator || "Eleanor Blake",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=32&auto=format&fit=crop",
    },
    title: auction?.item_name || "Harry Potter and the Philosopher's Stone – Collector's Limited Gold Edition",
    description: auction?.description || "This rare collector's edition features gold-trimmed pages, original cover art, and exclusive behind-the-scenes notes by J.K. Rowling.",
    currentBid: auction?.highest_bid || 305.00,
    startingBid: auction?.starting_price || 300.00,
    condition: auction?.condition?.toUpperCase() || "USED",
    categories: ["Books", "Comics"],
    endTime: {
      days: 205,
      hours: 11,
      minutes: 7,
      seconds: 30,
      fullDate: "November 30, 2025 12:00 am",
      timeZone: "GT",
    },
  };

  // Sample auction history data
  const auctionHistory = [
    {
      bidder: {
        name: "Michael Johnson",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=32&auto=format&fit=crop",
      },
      amount: 305.00,
      date: "May 14, 2025 - 10:45 AM",
      status: "current" as const,
    },
    {
      bidder: {
        name: "Sarah Williams",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=32&auto=format&fit=crop",
      },
      amount: 300.00,
      date: "May 13, 2025 - 3:22 PM",
      status: "outbid" as const,
    },
    {
      bidder: {
        name: "Robert Chen",
        image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=32&auto=format&fit=crop",
      },
      amount: 285.00,
      date: "May 12, 2025 - 9:15 AM",
      status: "outbid" as const,
    },
    {
      bidder: {
        name: "Amanda Parker",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=32&auto=format&fit=crop",
      },
      amount: 270.00,
      date: "May 10, 2025 - 5:30 PM",
      status: "outbid" as const,
    },
  ];

  // Sample reviews data
  const reviews = [
    {
      reviewer: {
        name: "James Wilson",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=48&auto=format&fit=crop",
      },
      date: "May 2, 2025",
      rating: 5.0,
      comment: "Absolutely stunning edition! The gold detailing is exquisite and the quality of the binding is exceptional. Eleanor was very helpful and the item arrived in perfect condition, exactly as described. A true collector's dream!",
    },
    {
      reviewer: {
        name: "Thomas Reynolds",
        image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=48&auto=format&fit=crop",
      },
      date: "April 15, 2025",
      rating: 4.5,
      comment: "I've been collecting Harry Potter editions for years, and this is one of the finest I've seen. The annotations from J.K. Rowling add incredible value to an already beautiful piece. Shipping was a bit slow, but the quality makes up for it.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#021f49] to-[#010915] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ef863f]"></div>
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
            <ImageGallery 
              images={productImages} 
              productName={auctionDetails.title} 
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-6">
            <AuctionDetails {...auctionDetails} />
            <BiddingSection 
              currentBid={auctionDetails.currentBid} 
              onBid={handleBid} 
            />
          </div>
        </div>

        {/* Tabs Section */}
        <AuctionTabs 
          description={auctionDetails.description}
          auctionHistory={auctionHistory}
          reviews={reviews}
        />

        {/* Related Products Section */}
        <RelatedProducts 
          currentAuctionId={auctionId}
          category={auction?.category}
        />
      </main>
    </div>
  );
}
