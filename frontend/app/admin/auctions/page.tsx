/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
  FaCopy,
  FaRegCopy,
} from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Auction } from "../../../lib/interfaces";
import AuctionDetailsModal from "../../../app/components/AuctionDetailsModal";

const AuctionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [detailsOpen, setDetailsOpen] = useState(false);

  // get all auctions
  useEffect(() => {
    const fetchAllAuctions = async () => {
      setLoading(true);
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

        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || res.statusText);
          setAuctions([]);
          return;
        }

        setAuctions(data);
      } catch (e) {
        console.error(e);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAuctions();
  }, []);

  // filter auctions
  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearch =
      auction.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.auction_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || auction.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || auction.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // delete auction
  const handleDelete = async (auctionId: string) => {
    if (!confirm("Are you sure you want to delete this auction?")) return;

    try {
      const res = await fetch(
        "https://asyncawait-auction-project.onrender.com/api/auctions/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ auction_id: auctionId }),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to delete auction");
        return;
      }

      toast.success("Auction deleted successfully");
      setAuctions((prev) =>
        prev.filter((a) => a.auction_id !== auctionId)
      );
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while deleting");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="text-white p-4 md:p-6 rounded-xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Manage Auctions</h1>
        </div>

        {/* Filters */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[150px]">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <FaFilter className="ml-3 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none text-white py-2 pl-2 pr-8 w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0d1d33]">All Status</option>
                  <option value="active" className="bg-[#0d1d33]">Active</option>
                  <option value="ended" className="bg-[#0d1d33]">Ended</option>
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[150px]">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <FaFilter className="ml-3 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent border-none text-white py-2 pl-2 pr-8 w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0d1d33]">All Categories</option>
                  <option value="electronics" className="bg-[#0d1d33]">Electronics</option>
                  <option value="fashion" className="bg-[#0d1d33]">Fashion</option>
                  <option value="art" className="bg-[#0d1d33]">Art</option>
                  <option value="jewelry" className="bg-[#0d1d33]">Jewelry</option>
                  <option value="sports" className="bg-[#0d1d33]">Sports</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Start Bid</th>
                  <th className="py-3 px-4">Current Bid</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAuctions.length ? (
                  filteredAuctions.map((auction) => (
                    <motion.tr key={auction.auction_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="hover:bg-white/5">
                      <td className="py-3 px-4 whitespace-nowrap select-none">
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              navigator.clipboard.writeText(auction.auction_id);
                              toast.success("Auction ID copied to clipboard!");
                            }
                          }}
                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10"
                          title={auction.auction_id}
                        >
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-mono">
                            {auction.auction_id.slice(0, 6)}...
                          </span>
                          <FaRegCopy size={12} className="text-purple-400 hover:text-purple-600 cursor-pointer" />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300 max-w-[200px] truncate" title={auction.item_name}>
                        {auction.item_name}
                      </td>
                      <td className="py-3 px-4 text-sm">{auction.creator}</td>
                      <td className="py-3 px-4 text-sm text-blue-400">
                        <span className="bg-blue-500/10 px-2 py-1 rounded text-xs">{auction.category}</span>
                      </td>
                      <td className="py-3 px-4 text-sm">${auction.starting_price}</td>
                      <td className="py-3 px-4 text-sm font-medium text-green-400">${auction.highest_bid}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{formatDate(auction.end_time)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${auction.status === "live" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg cursor-pointer " title="View">
                            <FaEye size={14} onClick={() => setDetailsOpen(true)}/>
                          </button>
                          <button onClick={() => handleDelete(auction.auction_id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg cursor-pointer " title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Auction details Modal */}
                      <AuctionDetailsModal
                        open={detailsOpen}
                        onClose={() => {
                          setDetailsOpen(false);
                        }}
                        auction={auction}
                      />
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-gray-400 italic">
                      No auctions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuctionsPage;
