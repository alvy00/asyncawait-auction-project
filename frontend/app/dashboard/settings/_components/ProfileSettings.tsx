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
  const [bio, setBio] = useState("I'm an auction enthusiast looking for unique items.");
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name, email });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6"
    >
      <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 mb-4">
            <Image 
              src="https://i.pravatar.cc/300" 
              alt="Profile" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" />
            </div>
          </div>
          <Button 
            className="bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-3 rounded-md flex items-center gap-2"
          >
            <Upload size={14} />
            Change Photo
          </Button>
        </div>
        
        {/* Profile Form */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="text-white py-2">{name}</div>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="text-white py-2">{email}</div>
              )}
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
              ) : (
                <div className="text-white py-2">{bio}</div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20"
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