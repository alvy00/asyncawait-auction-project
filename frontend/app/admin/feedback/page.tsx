"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSmile, FaMeh, FaFrown, FaStar, FaPaperPlane, FaThumbsUp, FaCommentAlt, FaExclamationCircle } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

// Sample feedback data
const SAMPLE_FEEDBACK = [
  { id: 1, user: "Ajay Ahmad", date: "Dec 20, 2023", type: "suggestion", message: "It would be great to have a dark mode option for the auction dashboard.", status: "new" },
  { id: 2, user: "Manvir Singh", date: "Dec 19, 2023", type: "issue", message: "I'm experiencing lag when filtering through large auction lists.", status: "in-progress" },
  { id: 3, user: "Shahriar Islam", date: "Dec 18, 2023", type: "praise", message: "The new bid notification system is fantastic! Really improved my workflow.", status: "resolved" },
  { id: 4, user: "Sohaan Khan", date: "Dec 17, 2023", type: "suggestion", message: "Could we add a batch processing feature for approving multiple auctions?", status: "new" },
  { id: 5, user: "Amitav Hasan", date: "Dec 16, 2023", type: "issue", message: "The export to CSV feature isn't including all transaction details.", status: "in-progress" },
];

const FeedbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(SAMPLE_FEEDBACK);
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("submit");

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmitFeedback = () => {
    if (!feedbackMessage.trim()) {
      toast.error("Please enter your feedback message");
      return;
    }
    
    if (satisfaction === null) {
      toast.error("Please select your satisfaction level");
      return;
    }
    
    // Simulate feedback submission
    toast.success("Feedback submitted successfully!");
    setFeedbackMessage("");
    setSatisfaction(null);
  };

  const getFeedbackTypeIcon = (type: string) => {
    switch(type) {
      case 'suggestion':
        return <FaCommentAlt className="text-blue-400" />;
      case 'issue':
        return <FaExclamationCircle className="text-red-400" />;
      case 'praise':
        return <FaThumbsUp className="text-green-400" />;
      default:
        return <FaCommentAlt className="text-blue-400" />;
    }
  };

  const getFeedbackStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-xs font-medium">New</span>;
      case 'in-progress':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-xs font-medium">In Progress</span>;
      case 'resolved':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-medium">Resolved</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-md text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="text-white p-4 md:p-6 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Feedback Center</h1>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === 'submit' ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              onClick={() => setActiveTab('submit')}
            >
              Submit Feedback
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === 'view' ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              onClick={() => setActiveTab('view')}
            >
              View Feedback
            </button>
          </div>
        </div>

        {activeTab === 'submit' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6"
          >
            <h2 className="text-xl font-semibold mb-6">We Value Your Feedback</h2>
            
            {/* Satisfaction Rating */}
            <div className="mb-6">
              <label className="block text-white/80 mb-3">How satisfied are you with the admin dashboard?</label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${satisfaction === rating ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    onClick={() => setSatisfaction(rating)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaStar size={20} />
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Feedback Type */}
            <div className="mb-6">
              <label className="block text-white/80 mb-3">What type of feedback do you have?</label>
              <div className="flex flex-wrap gap-3">
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${feedbackType === 'suggestion' ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  onClick={() => setFeedbackType('suggestion')}
                >
                  <FaCommentAlt size={14} />
                  Suggestion
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${feedbackType === 'issue' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  onClick={() => setFeedbackType('issue')}
                >
                  <FaExclamationCircle size={14} />
                  Report Issue
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${feedbackType === 'praise' ? 'bg-gradient-to-r from-green-600 to-green-800 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  onClick={() => setFeedbackType('praise')}
                >
                  <FaThumbsUp size={14} />
                  Praise
                </button>
              </div>
            </div>
            
            {/* Feedback Message */}
            <div className="mb-6">
              <label className="block text-white/80 mb-3">Your feedback</label>
              <textarea
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 focus:border-blue-500 focus:outline-none transition-all duration-300 text-white min-h-[150px]"
                placeholder="Please share your thoughts, ideas, or report an issue..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
              />
            </div>
            
            {/* Submit Button */}
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              onClick={handleSubmitFeedback}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPaperPlane size={16} />
              Submit Feedback
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 p-4 border-b border-white/10 bg-white/5 font-medium text-white/80">
                <div className="col-span-1">#</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">User</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-4">Message</div>
                <div className="col-span-2">Status</div>
              </div>
              
              {feedback.map((item, index) => (
                <motion.div 
                  key={item.id}
                  className="grid grid-cols-12 p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <div className="col-span-1 text-white/60">#{item.id}</div>
                  <div className="col-span-2 text-white/80">{item.date}</div>
                  <div className="col-span-2 text-white">{item.user}</div>
                  <div className="col-span-1">{getFeedbackTypeIcon(item.type)}</div>
                  <div className="col-span-4 text-white/80 truncate">{item.message}</div>
                  <div className="col-span-2">{getFeedbackStatusBadge(item.status)}</div>
                </motion.div>
              ))}
            </div>
            
            {/* Feedback Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <motion.div 
                className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 backdrop-blur-md rounded-xl p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <FaCommentAlt className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Total Feedback</p>
                    <h3 className="text-2xl font-bold text-white">24</h3>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-green-900/30 to-green-800/30 backdrop-blur-md rounded-xl p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <FaThumbsUp className="text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Resolved</p>
                    <h3 className="text-2xl font-bold text-white">18</h3>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 backdrop-blur-md rounded-xl p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <FaExclamationCircle className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Pending</p>
                    <h3 className="text-2xl font-bold text-white">6</h3>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FeedbackPage;