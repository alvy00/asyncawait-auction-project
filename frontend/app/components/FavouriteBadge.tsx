/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface FavoritingButtonProps {
  userId: string;
  auctionId: string;
  initialFavorited?: boolean;
  isHovered: boolean;
}

const FavoritingButton = ({
  userId,
  auctionId,
  initialFavorited = false,
  isHovered,
}: FavoritingButtonProps) => {
  const [favourited, setFavourited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async () => {
    if (loading) return;
    if(!userId) return toast.error("Please login to favourite auctions")
    setLoading(true);

    const url = favourited
      ? "https://asyncawait-auction-project.onrender.com/api/auctions/unfavourite"
      : "https://asyncawait-auction-project.onrender.com/api/auctions/favourite";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          auction_id: auctionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update favorite status");
      }

      toast.success(favourited ? "Removed from favorites" : "Added to favorites");
      setFavourited((prev) => !prev);
    } catch (error: any) {
      console.error("Favorite toggle error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isHovered ? 1 : 0,
        scale: isHovered ? 1 : 0.8,
      }}
      transition={{ duration: 0.2 }}
      onClick={handleFavoriteClick}
      disabled={loading}
      aria-pressed={favourited}
      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full z-10 transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      title={favourited ? "Remove from favorites" : "Add to favorites"}
      type="button"
    >
      {favourited ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </motion.button>
  );
};

export default FavoritingButton;
