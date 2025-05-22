"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPen, FaImage, FaFileAlt, FaVideo, FaNewspaper, FaTag } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

// Sample content data
const SAMPLE_CONTENT = [
  { id: "#C001", title: "Welcome to AuctaSync", type: "page", author: "Admin", status: "published", lastUpdated: "Dec 15, 2023", views: 1245 },
  { id: "#C002", title: "How to Place Your First Bid", type: "article", author: "Content Team", status: "published", lastUpdated: "Dec 16, 2023", views: 876 },
  { id: "#C003", title: "Seller Guidelines", type: "page", author: "Admin", status: "published", lastUpdated: "Dec 17, 2023", views: 654 },
  { id: "#C004", title: "Upcoming Auction Events", type: "event", author: "Marketing", status: "published", lastUpdated: "Dec 18, 2023", views: 432 },
  { id: "#C005", title: "Premium Membership Benefits", type: "page", author: "Admin", status: "draft", lastUpdated: "Dec 19, 2023", views: 0 },
  { id: "#C006", title: "Authentication Process", type: "article", author: "Security Team", status: "published", lastUpdated: "Dec 20, 2023", views: 321 },
  { id: "#C007", title: "Winter Collection Preview", type: "banner", author: "Design Team", status: "scheduled", lastUpdated: "Dec 21, 2023", views: 0 },
  { id: "#C008", title: "Auction Success Stories", type: "article", author: "Content Team", status: "published", lastUpdated: "Dec 22, 2023", views: 543 },
  { id: "#C009", title: "Platform Maintenance Notice", type: "announcement", author: "Admin", status: "published", lastUpdated: "Dec 23, 2023", views: 987 },
  { id: "#C010", title: "Holiday Special Auctions", type: "event", author: "Marketing", status: "draft", lastUpdated: "Dec 24, 2023", views: 0 },
];

const ContentPage = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(SAMPLE_CONTENT);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const router = useRouter();

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter content based on search term and filters
  const filteredContent = content.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteContent = (id: string) => {
    // In a real app, you would call an API to delete the content
    toast.success(`Content ${id} deleted successfully`);
    setContent(content.filter(item => item.id !== id));
  };

  const getContentTypeIcon = (type: string) => {
    switch(type) {
      case 'page': return <FaFileAlt />;
      case 'article': return <FaNewspaper />;
      case 'event': return <FaTag />;
      case 'banner': return <FaImage />;
      case 'announcement': return <FaPen />;
      default: return <FaFileAlt />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
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
          <h1 className="text-2xl md:text-3xl font-bold">Content Management</h1>
          
          <div className="flex gap-2">
            <Link href="/admin/content/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
              >
                <FaPlus size={14} />
                <span>Create Content</span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Content Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Content</p>
                <h3 className="text-2xl font-bold mt-1">{content.length}</h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaFileAlt className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>10% increase</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Published</p>
                <h3 className="text-2xl font-bold mt-1">{content.filter(item => item.status === 'published').length}</h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <FaNewspaper className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>8% increase</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Drafts</p>
                <h3 className="text-2xl font-bold mt-1">{content.filter(item => item.status === 'draft').length}</h3>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <FaPen className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-yellow-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>2 pending review</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <h3 className="text-2xl font-bold mt-1">{content.reduce((sum, item) => sum + item.views, 0).toLocaleString()}</h3>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <FaEye className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>15% increase</span>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
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
                  <option value="published" className="bg-[#0d1d33]">Published</option>
                  <option value="draft" className="bg-[#0d1d33]">Draft</option>
                  <option value="scheduled" className="bg-[#0d1d33]">Scheduled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Type Filter */}
            <div className="relative min-w-[150px]">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <FaFilter className="ml-3 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent border-none text-white py-2 pl-2 pr-8 w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0d1d33]">All Types</option>
                  <option value="page" className="bg-[#0d1d33]">Pages</option>
                  <option value="article" className="bg-[#0d1d33]">Articles</option>
                  <option value="event" className="bg-[#0d1d33]">Events</option>
                  <option value="banner" className="bg-[#0d1d33]">Banners</option>
                  <option value="announcement" className="bg-[#0d1d33]">Announcements</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Updated</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Views</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-medium">
                          {item.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">{item.title}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md text-xs flex items-center gap-1 w-fit">
                          <span className="text-blue-400">{getContentTypeIcon(item.type)}</span>
                          <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{item.author}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">{item.lastUpdated}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{item.views.toLocaleString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg transition-colors duration-200"
                            title="View Content"
                          >
                            <FaEye size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 p-2 rounded-lg transition-colors duration-200"
                            title="Edit Content"
                          >
                            <FaEdit size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors duration-200"
                            title="Delete Content"
                            onClick={() => handleDeleteContent(item.id)}
                          >
                            <FaTrash size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-400 italic">
                      No content found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="py-4 px-6 flex items-center justify-between border-t border-white/10">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{filteredContent.length}</span> of <span className="font-medium text-white">{content.length}</span> items
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContentPage;