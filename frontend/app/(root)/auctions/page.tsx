/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import AuctionCard, { Auction } from "../../components/AuctionCard";
import BackButton from "../../components/BackButton";

const AuctionListingPage = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchAllAuctions = async () => {
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
          const r = await res.json();
          console.error(r.message || r.statusText);
          return;
        }

        const data = await res.json();
        setAuctions(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAllAuctions();
  }, []);

  return (
    <>
      <BackButton />
      
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
            Explore All Auctions
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.length > 0 ? (
              auctions.map((auction, index) => (
                <div
                  key={index}
                  className="hover:scale-105 transform transition-all duration-300 ease-in-out"
                >
                  <AuctionCard auction={auction} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full text-xl">
                No auctions available at the moment.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AuctionListingPage;
