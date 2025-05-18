"use client";

import { motion } from "framer-motion";

interface Activity {
  id: string;
  time: string;
  userName: string;
  action: string;
  extraInfo: string;
  actionType: "bid" | "auction" | "profile" | "starting" | "product";
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8 bg-[#0a1628]/40 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
        <div className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-md">
          <span>Last Hour</span>
        </div>
      </div>

      <div className="bg-[#0d1d33]/60 rounded-lg p-4 overflow-hidden">
        <div className="mb-3">
          <h3 className="text-sm font-medium mb-3">Activity Log</h3>
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 border-b border-white/10 pb-2">
            <div className="col-span-1">Time</div>
            <div className="col-span-2">User Name</div>
            <div className="col-span-5">Activity</div>
            <div className="col-span-2">Extra Info</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        </div>

        <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
          {activities.map((activity) => (
            <div key={activity.id} className="grid grid-cols-12 gap-2 text-xs py-3 border-b border-white/5 items-center">
              <div className="col-span-1 text-gray-400">{activity.time}</div>
              <div className="col-span-2 text-white">{activity.userName}</div>
              <div className="col-span-5 text-gray-300">{activity.action}</div>
              <div className="col-span-2 text-gray-400">{activity.extraInfo}</div>
              <div className="col-span-2 text-right flex justify-end space-x-2">
                <button className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-xs hover:bg-red-500/30 transition-colors">
                  Delete
                </button>
                <button className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs hover:bg-blue-500/30 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivities;