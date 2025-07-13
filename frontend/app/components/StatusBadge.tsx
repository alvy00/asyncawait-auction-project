import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaArrowDown,
  FaBan,
  FaBolt,
  FaClock,
  FaHourglassHalf,
  FaStopwatch,
  FaFlagCheckered,
  FaGavel,
} from "react-icons/fa";

const StatusBadge = ({ type, status, auctionId }) => {
  useEffect(() => {
    if (status.toLowerCase() === "ended") {
      const updateStatusEnd = async () => {
        try {
          const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/updatestatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ auctionId, status: "ended" }),
          });

          if (res.ok) {
            const json = await res.json();
            console.log(json.message);
          } else {
            console.error("Failed to update auction status", res.status);
          }
        } catch (error) {
          console.error("Error updating auction status:", error);
        }
      };

      updateStatusEnd();
    }
  }, [status, auctionId]);

  let bgClasses = "";
  let text = "";
  let Icon = null;
  let tooltipText = "";

  const normalizedStatus = status.toLowerCase();

  if (type === "classic") {
    switch (normalizedStatus) {
      case "live":
        bgClasses = "bg-gradient-to-r from-green-700 to-green-500";
        text = "CLASSIC | LIVE";
        Icon = FaBolt;
        tooltipText = "Standard auction in progress";
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-500 to-yellow-400";
        text = "CLASSIC | UPCOMING";
        Icon = FaClock;
        tooltipText = "Auction starts soon";
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "CLASSIC | ENDED";
        Icon = FaFlagCheckered;
        tooltipText = "Auction has ended";
        break;
      default:
        return null;
    }
  } else if (type === "dutch") {
    switch (normalizedStatus) {
      case "live":
        bgClasses = "bg-gradient-to-r from-blue-500 to-blue-400";
        text = "DUTCH | LIVE";
        Icon = FaHourglassHalf;
        tooltipText = "Price drops with time!";
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-500 to-yellow-400";
        text = "DUTCH | UPCOMING";
        Icon = FaBolt;
        tooltipText = "Auction starts soon";
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "DUTCH | ENDED";
        Icon = FaStopwatch;
        tooltipText = "Auction has ended";
        break;
      default:
        return null;
    }
  } else if (type === "reverse") {
    switch (normalizedStatus) {
      case "live":
        bgClasses = "bg-gradient-to-r from-purple-700 to-purple-600";
        text = "REVERSE | LIVE";
        Icon = FaArrowDown;
        tooltipText = "The lowest bidder wins";
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-600 to-yellow-500";
        text = "REVERSE | UPCOMING";
        Icon = FaClock;
        tooltipText = "Auction starts soon";
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "REVERSE | ENDED";
        Icon = FaBan;
        tooltipText = "Auction has ended";
        break;
      default:
        return null;
    }
  } else if (type === "blitz") {
    switch (normalizedStatus) {
      case "live":
        bgClasses = "bg-gradient-to-r from-orange-800 to-orange-600";
        text = "BLITZ | LIVE";
        Icon = FaBolt;
        tooltipText = "High paced bidding only open for couple of minutes!";
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-500 to-yellow-400";
        text = "BLITZ | UPCOMING";
        Icon = FaHourglassHalf;
        tooltipText = "Auction starts soon";
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "BLITZ | ENDED";
        Icon = FaStopwatch;
        tooltipText = "Auction has ended";
        break;
      default:
        return null;
    }
  } else if (type === "phantom") {
    switch (normalizedStatus) {
      case "live":
        bgClasses = "bg-gradient-to-r from-yellow-800 to-yellow-600";
        text = "PHANTOM | LIVE";
        Icon = FaBolt;
        tooltipText = "Place hidden bids!";
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-500 to-yellow-400";
        text = "PHANTOM | UPCOMING";
        Icon = FaHourglassHalf;
        tooltipText = "Auction starts soon";
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "PHANTOM | ENDED";
        Icon = FaStopwatch;
        tooltipText = "Auction has ended";
        break;
      default:
        return null;
    }
  }

  return (
    <motion.div
      animate={normalizedStatus === "live" ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{ repeat: normalizedStatus === "live" ? Infinity : 0, duration: 1.5, ease: "easeInOut" }}
      className={`${bgClasses} text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2`}
      title={tooltipText}
    >
      {Icon && <Icon className="text-white" />}
      <span>{text}</span>
    </motion.div>
  );
};

export default StatusBadge;
