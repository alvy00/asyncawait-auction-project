/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { FaTag, FaDollarSign, FaRegCalendarAlt, FaImage, FaBoxOpen } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AuctionCreationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("sessionToken");
  
      if (!token) {
        console.warn("No session token found");
        return;
      }
  
      try {
        const res = await fetch('/api/getUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          const err = await res.json();
          console.error("Failed to fetch user:", err.message || res.statusText);
          return;
        }
  
        const user = await res.json();
        setCurrentUser(user);
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

    if (!currentUser) {
      toast.error("You need to be logged in to create an auction.");
      return;
    }

    try{
      const formData = new FormData(e.currentTarget);
      const body = {
        user_id: currentUser.id,
        item_name: formData.get('item_name'),
        description: formData.get('description'),
        category: formData.get('category'),
        condition: formData.get('condition'),
        starting_price: formData.get('starting_price'),
        buy_now: formData.get('buy_now'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time'),
        status: formData.get('status'),
        images: imageUrls.filter(url => url.trim() !== ""),
      };

      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions/create', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(body),
      });

      const r = await res.json();
      if (res.ok) {
        toast.success("Auction created successfully");
        router.push('/auctions');
      } else {
        toast.error(r.message);
      }

    }catch(e){
      toast.error("Auction creation failed");
      console.error("Error creating auction", e);

    }finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading user...
      </div>
    );
  }

  return (
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

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-lg font-medium text-gray-600">Status</Label>
        <div className="relative">
          <FaRegCalendarAlt className="absolute top-3 left-3 text-gray-500" />
          <select
            id="status"
            name="status"
            required
            className="pl-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">Select status</option>
            <option value="ongoing">Ongoing</option>
            <option value="ended">Ended</option>
          </select>
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
    </form>
  );
}
