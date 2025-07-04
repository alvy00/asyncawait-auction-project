/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
  FaLock,
  FaUnlock,
  FaUserPlus,
  FaRegCopy,
} from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import { User } from "../../../lib/interfaces";
import { useUser } from "../../../lib/user-context";

type FilterOption = {
  label: string;
  value: string;
};

const FilterSelect = ({
  icon,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  options: FilterOption[];
}) => (
  <div className="relative min-w-[150px]">
    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none text-white py-2 pl-2 pr-8 w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value} className="bg-[#0d1d33]">
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
);

const UsersPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  // Copy user ID to clipboard with toast
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("User ID copied to clipboard");
  };

  // Fetch users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(
          "https://asyncawait-auction-project.onrender.com/api/admin/users",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) {
          console.error("Error fetching users");
          return;
        }
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        console.error("Fetch failed:", e);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter users
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" && user.verified) ||
        (verificationFilter === "unverified" && !user.verified);

      return (
        matchesSearch && matchesStatus && matchesRole && matchesVerification
      );
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter, verificationFilter]);

  // Delete user handler
  const handleDeleteUser = async (user_id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        "https://asyncawait-auction-project.onrender.com/api/admin/deleteuser",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Failed to delete user: ${errorData.message || "Unknown error"}`);
        return;
      }

      setUsers((prev) => prev.filter((user) => user.user_id !== user_id));
      setFilteredUsers((prev) => prev.filter((user) => user.user_id !== user_id));
      toast.success("User deleted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while deleting the user");
    }
  };

  // Lock/unlock toggle stub (you need to implement backend call)
  const handleToggleLock = (user_id: string, currentlySuspended: boolean) => {
    // Optimistic UI update:
    const updatedUsers = users.map((u) =>
      u.user_id === user_id ? { ...u, is_suspended: !currentlySuspended } : u
    );
    setUsers(updatedUsers);
    toast.success(
      `User ${user_id} ${currentlySuspended ? "unlocked" : "locked"} successfully`
    );
    // TODO: Implement actual backend update
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="text-white p-4 md:p-6 rounded-xl max-w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Manage Users</h1>
          <Link href="/admin/users/create" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              <FaUserPlus size={14} />
              <span>Add New User</span>
            </motion.button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow min-w-0">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 truncate"
              />
            </div>

            {/* Status Filter */}
            <FilterSelect
              icon={<FaFilter className="ml-3 text-gray-400" />}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Suspended", value: "suspended" },
              ]}
            />

            {/* Role Filter */}
            <FilterSelect
              icon={<FaFilter className="ml-3 text-gray-400" />}
              value={roleFilter}
              onChange={setRoleFilter}
              options={[
                { label: "All Roles", value: "all" },
                { label: "Admin", value: "admin" },
                { label: "Moderator", value: "moderator" },
                { label: "User", value: "user" },
              ]}
            />

            {/* Verification Filter */}
            <FilterSelect
              icon={<FaFilter className="ml-3 text-gray-400" />}
              value={verificationFilter}
              onChange={setVerificationFilter}
              options={[
                { label: "All Verification", value: "all" },
                { label: "Verified", value: "verified" },
                { label: "Unverified", value: "unverified" },
              ]}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-auto">
          <table className="w-full table-auto min-w-[700px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  ID
                </th>
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Join Date
                </th>
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Role
                </th>
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Auctions
                </th>
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Bids
                </th>
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-3 text-left text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Verified
                </th>
                <th className="py-3 px-3 text-right text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.user_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-white/5 transition-colors duration-150"
                  >
                    <td className="py-3 px-3 whitespace-nowrap text-xs font-mono text-purple-400 flex items-center gap-2">
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-mono truncate">
                        {user.user_id.slice(0, 6)}...{user.user_id.slice(-4)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(user.user_id)}
                        title="Copy full ID"
                        aria-label="Copy user ID"
                        type="button"
                        className="text-purple-400 hover:text-purple-600 transition-colors cursor-pointer"
                      >
                        <FaRegCopy />
                      </button>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs md:text-sm text-gray-300 max-w-[100px] truncate">
                      {new Date(user.join_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-sm font-medium max-w-[150px] truncate">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold uppercase">
                          {user.name?.charAt(0) || "?"}
                        </div>
                        <span className="truncate">{user.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs md:text-sm text-gray-300 max-w-[180px] truncate">
                      {user.email}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs md:text-sm max-w-[90px] truncate">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium inline-block truncate ${
                          user.is_admin
                            ? "bg-red-600/20 text-red-600"
                            : "bg-blue-600/20 text-blue-600"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs md:text-sm max-w-[60px] truncate">
                      {user.total_auctions}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs md:text-sm max-w-[60px] truncate">
                      {user.total_bids}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs md:text-sm max-w-[80px] truncate">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium inline-block ${
                          !user.is_suspended
                            ? "bg-green-600/20 text-green-600"
                            : "bg-red-600/20 text-red-600"
                        }`}
                      >
                        {!user.is_suspended ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs md:text-sm max-w-[90px] truncate">
                      {user.verified ? (
                        <span className="bg-green-600/20 text-green-600 px-2 py-1 rounded-md text-xs font-medium flex items-center w-fit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="bg-red-600/20 text-red-600 px-2 py-1 rounded-md text-xs font-medium flex items-center w-fit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Not Verified
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 whitespace-nowrap text-right text-sm flex justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.user_id}`}
                        title="View User"
                        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg cursor-pointer"
                      >
                        <FaEye />
                      </Link>

                      <button
                        title={user.is_suspended ? "Unlock User" : "Lock User"}
                        onClick={() => handleToggleLock(user.user_id, user.is_suspended)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                          user.is_suspended
                            ? "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                            : "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {user.is_suspended ? <FaUnlock /> : <FaLock />}
                      </button>

                      <button
                        title="Delete User"
                        onClick={() => handleDeleteUser(user.user_id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="py-6 text-center text-gray-400 text-sm italic"
                  >
                    No users found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UsersPage;
