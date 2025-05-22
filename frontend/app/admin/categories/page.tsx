"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaFolder, FaFolderOpen } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

// Sample categories data
const SAMPLE_CATEGORIES = [
  { id: "#C001", name: "Electronics", slug: "electronics", description: "Electronic devices and gadgets", items: 156, featured: true, createdAt: "Dec 10, 2023" },
  { id: "#C002", name: "Fashion", slug: "fashion", description: "Clothing, shoes, and accessories", items: 142, featured: true, createdAt: "Dec 11, 2023" },
  { id: "#C003", name: "Home & Garden", slug: "home-garden", description: "Home decor, furniture, and garden supplies", items: 134, featured: true, createdAt: "Dec 12, 2023" },
  { id: "#C004", name: "Collectibles", slug: "collectibles", description: "Rare items and collectibles", items: 128, featured: false, createdAt: "Dec 13, 2023" },
  { id: "#C005", name: "Vehicles", slug: "vehicles", description: "Cars, motorcycles, and vehicle parts", items: 115, featured: true, createdAt: "Dec 14, 2023" },
  { id: "#C006", name: "Art", slug: "art", description: "Paintings, sculptures, and art pieces", items: 98, featured: false, createdAt: "Dec 15, 2023" },
  { id: "#C007", name: "Jewelry", slug: "jewelry", description: "Rings, necklaces, and precious stones", items: 87, featured: true, createdAt: "Dec 16, 2023" },
  { id: "#C008", name: "Sports", slug: "sports", description: "Sports equipment and memorabilia", items: 76, featured: false, createdAt: "Dec 17, 2023" },
  { id: "#C009", name: "Books", slug: "books", description: "Books, magazines, and literature", items: 65, featured: false, createdAt: "Dec 18, 2023" },
  { id: "#C010", name: "Toys & Games", slug: "toys-games", description: "Toys, games, and entertainment items", items: 54, featured: true, createdAt: "Dec 19, 2023" },
];

const CategoriesPage = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const router = useRouter();

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter categories based on search term and filters
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFeatured = featuredFilter === "all" || 
      (featuredFilter === "featured" && category.featured) || 
      (featuredFilter === "not-featured" && !category.featured);
    
    return matchesSearch && matchesFeatured;
  });

  const handleDeleteCategory = (id: string) => {
    // In a real app, you would call an API to delete the category
    toast.success(`Category ${id} deleted successfully`);
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    const updatedCategories = categories.map(category => 
      category.id === id ? { ...category, featured: !category.featured } : category
    );
    setCategories(updatedCategories);
    const category = categories.find(c => c.id === id);
    toast.success(`${category?.name} ${category?.featured ? 'removed from' : 'added to'} featured categories`);
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
          <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
          
          <Link href="/admin/categories/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              <FaPlus size={14} />
              <span>Add Category</span>
            </motion.button>
          </Link>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Featured Filter */}
            <div className="relative min-w-[180px]">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <FaFolder className="ml-3 text-gray-400" />
                <select
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                  className="bg-transparent border-none text-white py-2 pl-2 pr-8 w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0d1d33]">All Categories</option>
                  <option value="featured" className="bg-[#0d1d33]">Featured Only</option>
                  <option value="not-featured" className="bg-[#0d1d33]">Not Featured</option>
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

        {/* Categories Table */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Items</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Featured</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <motion.tr 
                      key={category.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-medium">
                          {category.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">{category.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">{category.slug}</td>
                      <td className="py-3 px-4 text-sm text-gray-300 max-w-[200px] truncate">{category.description}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md text-xs">
                          {category.items} items
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${category.featured ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {category.featured ? 'Featured' : 'Not Featured'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">{category.createdAt}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <FaEye size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 p-2 rounded-lg transition-colors duration-200"
                            title="Edit Category"
                          >
                            <FaEdit size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${category.featured ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400' : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'} p-2 rounded-lg transition-colors duration-200`}
                            title={category.featured ? 'Remove from Featured' : 'Add to Featured'}
                            onClick={() => handleToggleFeatured(category.id)}
                          >
                            {category.featured ? <FaFolderOpen size={14} /> : <FaFolder size={14} />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors duration-200"
                            title="Delete Category"
                            onClick={() => handleDeleteCategory(category.id)}
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
                      No categories found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="py-4 px-6 flex items-center justify-between border-t border-white/10">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{filteredCategories.length}</span> of <span className="font-medium text-white">{categories.length}</span> categories
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

export default CategoriesPage;