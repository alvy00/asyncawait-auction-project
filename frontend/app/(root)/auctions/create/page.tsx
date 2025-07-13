/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { DropzoneUploader } from "../../../components/DropzoneUploader";
import { FaTwitter, FaTelegramPlane, FaTag, FaDollarSign, FaRegCalendarAlt, FaImage, FaBoxOpen, FaGavel } from "react-icons/fa";
import { FaCrown } from 'react-icons/fa';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "../../../../lib/user-context";

const auctionTypes = [
  { value: 'classic', label: 'Classic', description: 'Standard auction, highest bid wins.' },
  { value: 'blitz', label: 'Blitz', description: 'Short time, rapid bidding.' },
  { value: 'dutch', label: 'Dutch', description: 'Price starts high and decreases over time.' },
  { value: 'reverse', label: 'Reverse', description: 'Lowest bid wins instead of highest.' },
  { value: 'phantom', label: 'Phantom', description: 'Bids remain hidden until the auction ends, then the winner is revealed.' }
];

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
      <div className="absolute inset-4 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-300"></div>
    </div>
  </div>
);

export default function AuctionCreationForm() {
  const { user } = useUser();
  const [startTime, setStartTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedType, setSelectedType] = useState(auctionTypes[0]);
  const [newAuctionTitle, setNewAuctionTitle] = useState<string>("");
  const router = useRouter();

  // Construct share URL based on new auction title
  const shareUrl = `https://auctasync.vercel.app/auctions/live?search=${encodeURIComponent(newAuctionTitle)}`;

  // fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
      if (!token) {
        console.warn("No session token found");
        return;
      }

      try {
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getUser', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch user");
          return;
        }

        const userData = await res.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
      if (!token) {
        toast.error("No session token found");
        setIsLoading(false);
        return;
      }

      const formData = new FormData(e.currentTarget);
      const startTime = new Date(formData.get("start_time") as string);
      let endTime: Date;
      const endTimeStr = formData.get("end_time") as string;
      const durationStr = formData.get("duration") as string;

      if (endTimeStr) {
        endTime = new Date(endTimeStr);
      } else if (durationStr) {
        const duration = parseInt(durationStr, 10);
        endTime = new Date(startTime.getTime() + duration * 60000);
      } else {
        throw new Error("Either end_time or duration must be provided");
      }

      const now = new Date();
      let status = "upcoming";
      if (endTime < now) status = "ended";
      else if (startTime <= now) status = "live";

      const auctionBody = {
        creator: currentUser.name,
        item_name: formData.get('item_name') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        auction_type: formData.get('auction_type') as string,
        starting_price: parseFloat(formData.get('starting_price') as string),
        buy_now: formData.get('buy_now') ? parseFloat(formData.get('buy_now') as string) : undefined,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status,
        images: imageUrls.filter(url => url.trim()),
        condition: formData.get('condition') as string,
      };

      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(auctionBody),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Auction created successfully");
        setNewAuctionTitle(auctionBody.item_name);
        setIsDialogOpen(true);
      } else {
        toast.error(result.message || "Failed to create auction");
      }
    } catch (error) {
      toast.error("Auction creation failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Redirect if not logged in
  // useEffect(() => {
  //   if (user === null) {
  //     toast.error("Please login first to create auctions");
  //     router.push('/login');
  //   }
  // }, [user, router]);

  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="min-h-screen bg-[#0A111B] py-12 px-4 sm:px-6 relative overflow-hidden mt-10">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Orange/red gradient bubble - top right */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500 rounded-full filter blur-[80px] opacity-20 animate-pulse-slow"></div>
        
        {/* Blue accent bubble - bottom left */}
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-blue-600 rounded-full filter blur-[70px] opacity-10 animate-float"></div>
        
        {/* Purple accent bubble - middle right */}
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-600 rounded-full filter blur-[60px] opacity-10 animate-float-delayed"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white font-serif mb-2"
          >
            Create Your Auction
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Fill in the details below to list your item for auction. High-quality images and detailed descriptions attract more bidders!
          </motion.p>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8 space-y-6">

            {/* Auction Type */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="auction_type" className="text-lg font-medium text-white/90">Auction Type</Label>
              <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                <FaCrown className="absolute top-3 left-3 text-orange-400" />
                <select
                  id="auction_type"
                  name="auction_type"
                  value={selectedType.value}
                  onChange={(e) => {
                    const selected = auctionTypes.find(type => type.value === e.target.value);
                    setSelectedType(selected);
                  }}
                  required
                  className="pl-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0A111B]">Select auction type</option>
                  {auctionTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-[#0A111B]">
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-orange-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Item Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="item_name" className="text-lg font-medium text-white/90">Item Name</Label>
              <div className="relative flex items-center overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                <FaTag className="absolute left-3 text-orange-400" />
                <Input
                  id="item_name"
                  name="item_name"
                  placeholder="Vintage Camera"
                  required
                  minLength={5}
                  maxLength={50}
                  className="pl-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-white/50"
                />
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="description" className="text-lg font-medium text-white/90">Description</Label>
              <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                <FaBoxOpen className="absolute top-3 left-3 text-orange-400" />
                <textarea
                  id="description"
                  name="description"
                  required
                  minLength={10}
                  placeholder="Describe your item in detail..."
                  className="pl-10 w-full py-3 bg-transparent border-none text-white focus:ring-0 placeholder:text-white/50 min-h-[120px] resize-y"
                />
              </div>
            </motion.div>

            {/* Category and Condition */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-lg font-medium text-white/90">Category</Label>
                <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                  <FaRegCalendarAlt className="absolute top-3 left-3 text-orange-400" />
                  <select 
                    id="category" 
                    name="category" 
                    required 
                    className="pl-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0A111B]">Select category</option>
                    <option value="electronics" className="bg-[#0A111B]">Electronics</option>
                    <option value="art" className="bg-[#0A111B]">Art</option>
                    <option value="fashion" className="bg-[#0A111B]">Fashion</option>
                    <option value="vehicles" className="bg-[#0A111B]">Vehicles</option>
                    <option value="other" className="bg-[#0A111B]">Other</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className="text-lg font-medium text-white/90">Condition</Label>
                <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                  <FaBoxOpen className="absolute top-3 left-3 text-orange-400" />
                  <select 
                    id="condition" 
                    name="condition" 
                    required 
                    className="pl-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0A111B]">Select condition</option>
                    <option value="new" className="bg-[#0A111B]">New</option>
                    <option value="used" className="bg-[#0A111B]">Used</option>
                    <option value="refurbished" className="bg-[#0A111B]">Refurbished</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Start & End Time or Duration Based on Auction Type */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Always show Start Time */}
              <div className="space-y-2">
                <Label htmlFor="start_time" className="text-lg font-medium text-white/90">Start Time</Label>
                <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                  <FaRegCalendarAlt className="absolute top-3 left-3 text-orange-400" />
                  <Input
                    type="datetime-local"
                    id="start_time"
                    name="start_time"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 calendar-white"
                  />
                </div>
              </div>

              {/* Conditionally show either End Time or Duration */}
              {selectedType?.value === "blitz" ? (
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-lg font-medium text-white/90">Duration (minutes)</Label>
                  <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                    <select
                      id="duration"
                      name="duration"
                      required
                      className="pl-4 pr-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 appearance-none cursor-pointer"
                    >
                      <option value="10" className="bg-[#0A111B]">5</option>
                      <option value="15" className="bg-[#0A111B]">10</option>
                      <option value="30" className="bg-[#0A111B]">15</option>
                      <option value="45" className="bg-[#0A111B]">30</option>
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none text-orange-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="end_time" className="text-lg font-medium text-white/90">End Time</Label>
                  <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                    <FaRegCalendarAlt className="absolute top-3 left-3 text-orange-400" />
                    <Input
                      type="datetime-local"
                      id="end_time"
                      name="end_time"
                      required
                      min={startTime || new Date().toISOString().slice(0, 16)}
                      className="pl-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 calendar-white"
                    />
                  </div>
                </div>
              )}

            </motion.div>
            
            {/* Prices */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="starting_price" className="text-lg font-medium text-white/90">Starting Price ($)</Label>
                <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                  <FaDollarSign className="absolute top-3 left-3 text-orange-400" />
                  <Input
                    type="number"
                    id="starting_price"
                    name="starting_price"
                    placeholder="0.00"
                    required
                    min={0}
                    step="0.01"
                    className="pl-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buy_now" className="text-lg font-medium text-white/90">Buy Now Price ($)</Label>
                <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50">
                  <FaDollarSign className="absolute top-3 left-3 text-orange-400" />
                  <Input
                    type="number"
                    id="buy_now"
                    name="buy_now"
                    placeholder="Optional"
                    min={0}
                    step="0.01"
                    className="pl-10 py-3 w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-white/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <DropzoneUploader imageUrls={imageUrls} setImageUrls={setImageUrls} />

            <motion.div 
              variants={itemVariants}
              className="pt-4"
            >
              <motion.button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <FaGavel className="text-white" />
                <span>{isLoading ? "Creating auction..." : "Create Auction"}</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <Link 
            href="/dashboard"
            className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>
      </motion.div>


      {/* Auction creation success modal */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) router.push('/auctions/live');
          }}>
          <DialogContent className="bg-gradient-to-b from-[#0A111B]/95 to-[#0A111B] backdrop-blur-xl border border-white/10 text-white max-w-md mx-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
                Auction Created!
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-center">
                Your auction is live! Share it to get more bids.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }} className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
                  <FaGavel className="h-10 w-10 text-white" />
                </motion.div>
              </div>

              {/* Copy Link */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
                <Button variant="outline" className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-6 rounded-xl transition-all duration-300" onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied to clipboard!");
                }}>
                  Copy Link
                </Button>
              </motion.div>

              {/* Social Buttons */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-between space-x-4">
                <Button variant="outline" className="w-1/2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-5 rounded-xl transition-all duration-300" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')}>
                  <FaTwitter className="mr-2 text-blue-400" /> Share on Twitter
                </Button>
                <Button variant="outline" className="w-1/2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-5 rounded-xl transition-all duration-300" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`, '_blank')}>
                  <FaTelegramPlane className="mr-2 text-blue-500" /> Share on Telegram
                </Button>
              </motion.div>

              {/* Preview Button */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Button className="w-full py-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 transition-all duration-300" onClick={() => router.push('/auctions')}>
                  View Auction
                </Button>
              </motion.div>
            </div>
          </DialogContent>
      </Dialog>

    </div>
  );
}

// Add this to your global CSS file
/*
.calendar-white::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
*/
