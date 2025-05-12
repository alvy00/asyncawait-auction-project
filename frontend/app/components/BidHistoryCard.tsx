import React from 'react'

const BidHistoryCard = ({ item_name, bid }: { item_name: string; bid: number }) => {
    const formattedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                Auction: <span className="font-semibold">{item_name}</span>
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formattedDate}
                </span>
            </div>

            <div className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                Bid: {bid}
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
                Status: <span className="text-green-600 dark:text-green-400">Leading</span>
            </div>
        </div>
  )
}

export default BidHistoryCard