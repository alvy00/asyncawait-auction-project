/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { DropzoneUploader } from "../../../components/DropzoneUploader";
import { FaTwitter, FaTelegramPlane, FaTag, FaDollarSign, FaRegCalendarAlt, FaImage, FaBoxOpen, FaGavel, FaCameraRetro, FaAlignLeft, FaTags, FaCogs, FaExchangeAlt } from "react-icons/fa";
import { FaCrown } from 'react-icons/fa';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "../../../../lib/user-context";
import Image from "next/image";

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
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    category: '',
    condition: '',
    auction_type: auctionTypes[0].value,
    starting_price: '',
    buy_now: '',
    start_time: '',
    end_time: '',
    duration: '',
    images: [] as string[],
  });

  const itemNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const conditionRef = useRef<HTMLSelectElement>(null);
  const auctionTypeRef = useRef<HTMLSelectElement>(null);

  const startingPriceRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLSelectElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const imagesRef = useRef<HTMLDivElement>(null);

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

  // Stepper steps
  const steps = [
    "Auction Details",
    "Pricing & Timing",
    "Images",
    "Preview & Submit"
  ];

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // step checks
  const validateCurrentStep = () => {
    switch (formStep) {
      case 0:
        if (!formData.item_name || formData.item_name.length < 5) {
          itemNameRef.current?.focus();
          return false;
        }
        if (!formData.description || formData.description.length < 10) {
          descriptionRef.current?.focus();
          return false;
        }
        if (!formData.category) {
          categoryRef.current?.focus();
          return false;
        }
        if (!formData.condition) {
          conditionRef.current?.focus();
          return false;
        }
        if (!formData.auction_type) {
          auctionTypeRef.current?.focus();
          return false;
        }
        return true;

      case 1:
        if (!formData.starting_price || parseFloat(formData.starting_price) < 0) {
          startingPriceRef.current?.focus();
          return false;
        }
        if (!formData.start_time) {
          startTimeRef.current?.focus();
          return false;
        }
        if (selectedType?.value === "blitz") {
          if (!formData.duration) {
            durationRef.current?.focus();
            return false;
          }
        } else {
          if (!formData.end_time) {
            endTimeRef.current?.focus();
            return false;
          }
        }
        return true;

      case 2:
        if (imageUrls.length === 0) {
          toast.error("Please upload at least one image.");
          return false;
        }
        return true;

      default:
        return true;
    }
  }

  // Handle next/prev step
  const nextStep = () => {
    if (!validateCurrentStep()) return;
    setFormStep((s) => Math.min(s + 1, steps.length - 1));
  }
  const prevStep = () => { setFormStep(s => Math.max(s - 1, 0)); }

  // Handle form submit
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
      const startTime = new Date(formData.start_time);
      let endTime: Date;
      if (formData.end_time) {
        endTime = new Date(formData.end_time);
      } else if (formData.duration) {
        const duration = parseInt(formData.duration, 10);
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
        item_name: formData.item_name,
        description: formData.description,
        category: formData.category,
        auction_type: formData.auction_type,
        starting_price: parseFloat(formData.starting_price),
        buy_now: formData.buy_now ? parseFloat(formData.buy_now) : undefined,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status,
        images: imageUrls.filter(url => url.trim()),
        condition: formData.condition,
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


  // Responsive hero/intro section
  const HeroSection = (
    <section className="relative w-full flex flex-col items-center justify-center py-12 md:py-20 bg-gradient-to-br from-orange-500/10 via-purple-700/10 to-blue-500/10 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="z-10 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
          <FaGavel className="text-orange-400 text-2xl" />
          <span className="text-white font-semibold tracking-wide text-lg">Create a New Auction</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif">List Your Item for Auction</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">Share your unique items with the world. Fill in the details, set your price, and let the bidding begin!</p>
      </motion.div>
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-orange-500 via-purple-600 to-blue-500 rounded-full filter blur-[120px] opacity-30 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-orange-400 to-purple-500 rounded-full filter blur-[100px] opacity-20 animate-float" />
    </section>
  );

  // Stepper/progress indicator
  const Stepper = (
    <div className="flex items-center justify-center gap-4 my-8">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${formStep === idx ? 'bg-orange-500 text-white border-orange-500 scale-110 shadow-lg' : 'bg-white/10 text-white border-white/20'}`}>{idx + 1}</div>
          <span className={`text-base font-medium ${formStep === idx ? 'text-orange-400' : 'text-gray-400'}`}>{step}</span>
          {idx < steps.length - 1 && <span className="w-8 h-1 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full mx-2" />}
        </div>
      ))}
    </div>
  );

  // Live preview/summary
  const Preview = (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl mt-8">
      <h2 className="text-xl font-bold text-white mb-2">Live Preview</h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/3 aspect-video bg-black/30 rounded-lg flex items-center justify-center overflow-hidden">
          {imageUrls[0] ? (
            <Image src={imageUrls[0]} alt="Preview" width={320} height={180} className="object-cover w-full h-full rounded-lg" />
          ) : (
            <span className="text-gray-500">Image Preview</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-2xl font-bold text-white">{formData.item_name || 'Auction Title'}</div>
          <div className="text-gray-300">{formData.description || 'Auction description will appear here.'}</div>
          <div className="flex gap-4 mt-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-semibold text-xs">{formData.auction_type || 'Type'}</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-xs">{formData.category || 'Category'}</span>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 font-semibold text-xs">{formData.condition || 'Condition'}</span>
          </div>
          <div className="mt-2 text-lg text-orange-300 font-bold">${formData.starting_price || '0.00'}</div>
        </div>
      </div>
    </motion.div>
  );

  // Main form sections
  const FormSections = [
    // Step 1: Auction Details
    <motion.div
      key={0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Item Name */}
      <div className="space-y-2">
        <Label htmlFor="item_name" className="text-lg font-medium text-white/90 flex items-center gap-2">
          <FaCameraRetro className="text-orange-400" />
          Item Name
        </Label>
        <Input
          ref={itemNameRef}
          id="item_name"
          name="item_name"
          placeholder="Vintage Camera"
          required
          minLength={5}
          maxLength={60}
          value={formData.item_name}
          onChange={handleInputChange}
          className="py-3 w-full bg-white/10 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-white/50"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-lg font-medium text-white/90 flex items-center gap-2">
          <FaAlignLeft className="text-orange-400" />
          Description
        </Label>
        <textarea
          ref={descriptionRef}
          id="description"
          name="description"
          required
          minLength={10}
          placeholder="Describe your item in detail..."
          value={formData.description}
          onChange={handleInputChange}
          className="w-full py-4 px-4 bg-white/10 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-white/50 min-h-[140px] resize-y leading-relaxed"
        />
      </div>

      {/* Category & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-lg font-medium text-white/90 flex items-center gap-2">
            <FaTags className="text-orange-400" />
            Category
          </Label>
          <select
            ref={categoryRef}
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleInputChange}
            className="py-3 px-3 w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer"
          >
            <option className="bg-[#1a1a1a] text-white" value="">Select Category</option>
            <option className="bg-[#1a1a1a] text-white" value="electronics">Electronics</option>
            <option className="bg-[#1a1a1a] text-white" value="art">Art</option>
            <option className="bg-[#1a1a1a] text-white" value="fashion">Fashion</option>
            <option className="bg-[#1a1a1a] text-white" value="vehicles">Vehicles</option>
            <option className="bg-[#1a1a1a] text-white" value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition" className="text-lg font-medium text-white/90 flex items-center gap-2">
            <FaCogs className="text-orange-400" />
            Condition
          </Label>
          <select
            ref={conditionRef}
            id="condition"
            name="condition"
            required
            value={formData.condition}
            onChange={handleInputChange}
            className="py-3 px-3 w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer"
          >
            <option className="bg-[#1a1a1a] text-white" value="">Select condition</option>
            <option className="bg-[#1a1a1a] text-white" value="new">New</option>
            <option className="bg-[#1a1a1a] text-white" value="used">Used</option>
            <option className="bg-[#1a1a1a] text-white" value="refurbished">Refurbished</option>
          </select>
        </div>
      </div>

    {/* Auction Type */}
    <div className="space-y-2">
      <Label htmlFor="auction_type" className="text-lg font-medium text-white/90 flex items-center gap-2">
        <FaExchangeAlt className="text-orange-400" />
        Auction Type
      </Label>
      <select
        ref={auctionTypeRef}
        id="auction_type"
        name="auction_type"
        required
        value={formData.auction_type}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, auction_type: e.target.value }));
          setSelectedType(auctionTypes.find((type) => type.value === e.target.value) || auctionTypes[0]);
        }}
        className="py-3 px-3 w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-white/50 appearance-none cursor-pointer"
      >
        {auctionTypes.map((type) => (
          <option key={type.value} value={type.value} className="bg-[#1a1a1a] text-white">
            {type.label}
          </option>
        ))}
      </select>

      {/* Description Box */}
      <div className="mt-1 p-3 rounded-lg border border-white/20 text-white shadow-lg flex items-center max-w-full inline-flex">
        <p className="text-sm leading-relaxed">{selectedType.description}</p>
      </div>
    </div>

    </motion.div>,

    // Step 2: Pricing & Timing
    <motion.div
      key={1}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="starting_price" className="text-lg font-medium text-white/90 flex items-center gap-2">
            <FaDollarSign className="text-orange-400" />
            Starting Price ($)
          </Label>
          <Input
            ref={startingPriceRef}
            type="number"
            id="starting_price"
            name="starting_price"
            placeholder="0.00"
            required
            min={0}
            step="0.01"
            value={formData.starting_price}
            onChange={handleInputChange}
            className="py-3 w-full bg-white/10 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buy_now" className="text-lg font-medium text-white/90 flex items-center gap-2">
            <FaTag className="text-orange-400" />
            Buy Now Price ($)
          </Label>
          <Input
            type="number"
            id="buy_now"
            name="buy_now"
            placeholder="Optional"
            min={0}
            step="0.01"
            value={formData.buy_now}
            onChange={handleInputChange}
            className="py-3 w-full bg-white/10 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="start_time" className="text-lg font-medium text-white/90 flex items-center gap-2">
            <FaRegCalendarAlt className="text-orange-400" />
            Start Time
          </Label>
          <Input
            ref={startTimeRef}
            type="datetime-local"
            id="start_time"
            name="start_time"
            required
            min={new Date().toISOString().slice(0, 16)}
            value={formData.start_time}
            onChange={handleInputChange}
            className="py-3 w-full bg-white/10 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 calendar-white"
          />
        </div>

        {selectedType?.value === "blitz" ? (
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-lg font-medium text-white/90 flex items-center gap-2">
              <FaRegCalendarAlt className="text-orange-400" />
              Duration (minutes)
            </Label>
            <select
              ref={durationRef}
              id="duration"
              name="duration"
              required
              value={formData.duration}
              onChange={handleInputChange}
              className="py-2 px-5 w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option className="bg-[#1a1a1a] text-white" value="">
                Select duration
              </option>
              <option className="bg-[#1a1a1a] text-white" value="10">
                10
              </option>
              <option className="bg-[#1a1a1a] text-white" value="15">
                15
              </option>
              <option className="bg-[#1a1a1a] text-white" value="30">
                30
              </option>
              <option className="bg-[#1a1a1a] text-white" value="45">
                45
              </option>
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="end_time" className="text-lg font-medium text-white/90 flex items-center gap-2">
              <FaRegCalendarAlt className="text-orange-400" />
              End Time
            </Label>
            <Input
              ref={endTimeRef}
              type="datetime-local"
              id="end_time"
              name="end_time"
              required
              min={formData.start_time || new Date().toISOString().slice(0, 16)}
              value={formData.end_time}
              onChange={handleInputChange}
              className="py-3 w-full bg-white/10 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 calendar-white"
            />
          </div>
        )}
      </div>
    </motion.div>,

    // Step 3: Images
    <motion.div
      key={2}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Label className="text-lg font-medium text-white/90 flex items-center gap-2">
        <FaImage className="text-orange-400" />
        Upload Images
      </Label>
      <DropzoneUploader imageUrls={imageUrls} setImageUrls={setImageUrls} />
      <div className="text-xs text-gray-400">Add at least one high-quality image to attract more bidders.</div>
    </motion.div>,

    // Step 4: Preview & Submit
    <motion.div key={3} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      {Preview}
      <Button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all duration-300 cursor-pointer" disabled={isLoading}>
        <FaGavel className="text-white" />
        <span>{isLoading ? "Creating auction..." : "Create Auction"}</span>
      </Button>
    </motion.div>
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#0A111B] flex flex-col">
      {HeroSection}
      <div className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-6 py-8">
        {Stepper}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10"
        >
          {FormSections[formStep]}
          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" className="rounded-xl px-6 py-2 text-white border-white/20 bg-white/10" onClick={prevStep} disabled={formStep === 0}>Back</Button>
            {formStep < steps.length - 1 && (
              <Button type="button" className="rounded-xl px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold" onClick={nextStep}>Next</Button>
            )}
          </div>
        </motion.form>
      </div>
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
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-slow {
          0% { opacity: 0.5; }
          50% { opacity: 0.7; }
          100% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Add this to your global CSS file
/*
.calendar-white::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
*/
