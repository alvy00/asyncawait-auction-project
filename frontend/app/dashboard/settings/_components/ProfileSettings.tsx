/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "../../../../lib/interfaces";
import { Button } from "../../../../components/ui/button";
import { Camera, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileSettingsProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const ProfileSettings = ({ user, onUpdate }: ProfileSettingsProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const imageSrc = user.image_url || "/fallback_user_avatar.png";

  // Handle update name, email, bio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const payload = { user_id: user.user_id };

      const responses = await Promise.all([
        fetch('https://asyncawait-auction-project.onrender.com/api/nameupdate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, name }),
        }),
        fetch('https://asyncawait-auction-project.onrender.com/api/emailupdate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, email }),
        }),
        fetch('https://asyncawait-auction-project.onrender.com/api/bioupdate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, bio }),
        }),
      ]);

      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update profile');
        }
      }

      onUpdate({ name, email, bio });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6"
    >
      <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30" />

      <div className="relative z-10 flex flex-col md:flex-row gap-10">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/30 shadow-md group">
            <Image
              src={imageSrc}
              alt="Profile"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" />
            </div>
          </div>
          <Button
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-3 rounded-md flex items-center gap-2 transition"
          >
            <Upload size={14} />
            Change Photo
          </Button>
        </div>

        {/* Profile Info Form */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
            Personal Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm text-white/70 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-white">{name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-white/70 mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-white">{email}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm text-white/70 mb-1">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  disabled={isLoading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-white whitespace-pre-wrap">{bio || <span className="text-white/50 italic">Not added yet!</span>}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all shadow-md shadow-orange-400/20"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all shadow-md shadow-orange-400/20"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
