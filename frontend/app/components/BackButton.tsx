import Link from 'next/link'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

const BackButton = () => {
  return (
    <Link href="..">
        <div className="fixed top-6 left-6 flex items-center space-x-2 text-2xl text-gray-700 dark:text-gray-300 hover:text-indigo-500 transform transition-all duration-300 ease-in-out group">
          <FaArrowLeft className="group-hover:rotate-180 transition-transform duration-500 ease-in-out" />
          <p className="text-lg font-semibold group-hover:text-indigo-500 transition-colors duration-300 ease-in-out">
            Back
          </p>
        </div>
    </Link>
  )
}

export default BackButton