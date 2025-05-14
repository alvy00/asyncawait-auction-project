/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog"
import { Button } from "../../../../components/ui/button"
import { FaTwitter, FaTelegramPlane } from "react-icons/fa"
import { FaTag, FaDollarSign, FaRegCalendarAlt, FaImage, FaBoxOpen } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AuctionCreationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
      if (!token) {
        console.warn("No session token found");
        return;
      }
  
      try {
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          const err = await res.json();
          console.error("Failed to fetch user:", err.message || res.statusText);
          return;
        }
  
        const userData = await res.json();
        setCurrentUser(userData);
        //console.log(userData)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleImageChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addImageField = () => setImageUrls((prev) => [...prev, ""]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");

      if (!token) {
        toast.error("No session token found");
        return;
      }

      const formData = new FormData(e.currentTarget);

      const startTime = new Date(formData.get('start_time') as string);
      const endTime = new Date(formData.get('end_time') as string);

      const startTimeUTC = new Date(startTime.toISOString());
      const endTimeUTC = new Date(endTime.toISOString());

      const now = new Date();

      let auctionStatus = 'upcoming';

      if (endTime < now) {
        auctionStatus = 'ended';
      } else if (startTime <= now) {
        auctionStatus = 'live';
      }

      const auctionBody = {
        creator: currentUser.name,
        item_name: formData.get('item_name') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as 'electronics' | 'art' | 'fashion' | 'vehicles' | 'other',
        starting_price: parseFloat(formData.get('starting_price') as string),
        buy_now: formData.get('buy_now') ? parseFloat(formData.get('buy_now') as string) : undefined,
        start_time: startTimeUTC.toISOString(),
        end_time: endTimeUTC.toISOString(),
        status: auctionStatus,
        images: imageUrls.filter(url => url.trim() !== ""),
        condition: formData.get('condition') as 'new' | 'used' | 'refurbished',
      };

      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions/create', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(auctionBody),
      });

      const r = await res.json();

      if (res.ok) {
        toast.success("Auction created successfully");
        setIsDialogOpen(true);
      } else {
        toast.error(r.message || "Failed to create auction");
      }
    } catch (e) {
      toast.error("Auction creation failed");
      console.error("Error creating auction:", e);
    } finally {
      setIsLoading(false);
    }
  };




  // if (!currentUser) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-xl text-gray-600">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Create an Auction</h2>

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="item_name" className="text-lg font-medium text-gray-600">Item Name</Label>
            <div className="relative flex items-center border border-gray-300 rounded-md shadow-sm">
              <FaTag className="absolute left-3 text-gray-500" />
              <Input
                id="item_name"
                name="item_name"
                placeholder="Vintage Camera"
                required
                minLength={5}
                maxLength={50}
                className="pl-10 py-2 w-full border-none outline-none focus:ring-2 focus:ring-orange-500 rounded-md"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg font-medium text-gray-600">Description</Label>
            <div className="relative">
              <FaBoxOpen className="absolute top-2 left-3 text-gray-500" />
              <textarea
                id="description"
                name="description"
                required
                minLength={10}
                placeholder="Describe the item..."
                className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-lg font-medium text-gray-600">Category</Label>
              <div className="relative">
                <FaRegCalendarAlt className="absolute top-3 left-3 text-gray-500" />
                <select id="category" name="category" required className="pl-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="art">Art</option>
                  <option value="fashion">Fashion</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition" className="text-lg font-medium text-gray-600">Condition</Label>
              <div className="relative">
                <FaRegCalendarAlt className="absolute top-3 left-3 text-gray-500" />
                <select id="condition" name="condition" required className="pl-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starting_price" className="text-lg font-medium text-gray-600">Starting Price ($)</Label>
              <div className="relative">
                <FaDollarSign className="absolute top-3 left-3 text-gray-500" />
                <Input
                  type="number"
                  id="starting_price"
                  name="starting_price"
                  placeholder="0.00"
                  required
                  min={0}
                  className="pl-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buy_now" className="text-lg font-medium text-gray-600">Buy Now Price ($)</Label>
              <div className="relative">
                <FaDollarSign className="absolute top-3 left-3 text-gray-500" />
                <Input
                  type="number"
                  id="buy_now"
                  name="buy_now"
                  placeholder="Optional"
                  min={0}
                  className="pl-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-lg font-medium text-gray-600">Start Time</Label>
              <div className="relative">
                <FaRegCalendarAlt className="absolute top-3 left-3 text-gray-500" />
                <Input
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  required
                  className="pl-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-lg font-medium text-gray-600">End Time</Label>
              <div className="relative">
                <FaRegCalendarAlt className="absolute top-3 left-3 text-gray-500" />
                <Input
                  type="datetime-local"
                  id="end_time"
                  name="end_time"
                  required
                  className="pl-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-600">Image URLs</Label>
            {imageUrls.map((url, index) => (
              <div key={index} className="relative flex items-center space-x-2 mb-2">
                <FaImage className="absolute left-3 text-gray-500" />
                <Input
                  type="url"
                  value={url}
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addImageField}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              + Add Image
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Creating auction..." : "Create Auction"}
          </Button>


          <Dialog 
            open={isDialogOpen} 
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                router.push("/auctions");
              }
            }}
            //trapFocus={true} 
            //closeOnEscape={false} 
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Auction Created!</DialogTitle>
                <DialogDescription>
                  Your auction is live! You can share it with others to get more bids.
                </DialogDescription>
              </DialogHeader>

              {/* Shareable Link */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  Copy Link
                </Button>
              </div>

              {/* Social Promotion Tips */}
              <div className="flex items-center justify-between space-x-4 mt-4">
                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={() =>
                    window.open("https://twitter.com/intent/tweet?url=" + window.location.href, "_blank")
                  }
                >
                  <FaTwitter className="mr-2" />
                  Share on Twitter
                </Button>

                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={() =>
                    window.open("https://t.me/share/url?url=" + window.location.href, "_blank")
                  }
                >
                  <FaTelegramPlane className="mr-2" />
                  Share on Telegram
                </Button>
              </div>

              {/* Preview Button */}
              <div className="mt-4">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  onClick={() => router.push('/auctions')}
                >
                  View Auction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </form>
    
    </>

  );
}
