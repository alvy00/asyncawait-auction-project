import React from 'react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col items-center p-8">
          <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">John Doe</h2>
          <p className="text-gray-600 dark:text-gray-400">john.doe@example.com</p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">About</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            I’m a full-stack developer who loves working with React, Node.js, and cloud technologies. I enjoy building tools that improve productivity and collaboration.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Contact</h3>
          <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
            <li><span className="font-medium">Phone:</span> +1 234 567 890</li>
            <li><span className="font-medium">Location:</span> San Francisco, CA</li>
            <li><span className="font-medium">Website:</span> johndoe.dev</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-right">
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-md">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
