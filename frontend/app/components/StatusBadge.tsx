import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowDown, FaBan, FaBolt, FaClock, FaHourglassHalf, FaStopwatch, FaUsers, FaFlagCheckered
} from "react-icons/fa";

const StatusBadge = ({ type, status, auctionId, participantCount }) => {

  // update status
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
      tooltipText = "The highest bidder wins";
      break;
    case "upcoming":
      bgClasses = "bg-gradient-to-r from-green-700 to-green-500";
      text = "CLASSIC | UPCOMING";
      Icon = FaClock;
      tooltipText = "Auction starts soon";
      break;
    case "ended":
      bgClasses = "bg-gray-600";
      text = "CLASSIC | ENDED";
      Icon = FaFlagCheckered;
      tooltipText = "Auction has ended";
      break;
    default:
      return null;
  }
  }else if (type === "dutch") {
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
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      {/* STATUS badge & tooltip */}
      <div className="relative group/status">
        <motion.div
          className={`${bgClasses} cursor-pointer text-white text-xs font-bold px-4 py-1 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm`}
        >
          {Icon && <Icon className="text-white" />}
          <span>{text}</span>
        </motion.div>

        {/* Tooltip for status */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 text-[11px] text-emerald-100 bg-emerald-900/80 rounded-md shadow-xl opacity-0 group-hover/status:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm z-20">
          <span className="block text-center">{tooltipText}</span>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-emerald-900/80 shadow-md" />
        </div>
      </div>

      {/* PARTICIPANTS badge & tooltip */}
      <div className="relative group/participants">
        <div className="flex items-center gap-1 text-white text-sm bg-gray-700/80 px-2 py-1 rounded-md shadow backdrop-blur-sm cursor-pointer">
          <FaUsers className="text-white text-base" />
          <span>{participantCount ?? "0"}</span>
        </div>

        {/* Tooltip for participants */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 text-[11px] text-white bg-gray-900/90 rounded shadow-lg opacity-0 group-hover/participants:opacity-100 transition-opacity duration-300 pointer-events-none z-20 whitespace-nowrap">
          {participantCount === 1
            ? "1 participant"
            : `${participantCount ?? 0} participants`}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900/90 shadow-sm" />
        </div>
      </div>
    </div>

  );
};

export default StatusBadge;
