'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();

  const handleHelpClick = () => {
    router.push('/help'); // Replace with your help route
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white  py-3 px-4 md:px-8 flex items-center justify-between">
      {/* Logo + Brand */}
      <div className="flex items-center space-x-2">
        <Image
          src="/image/appLogoT.png" // Make sure this path is correct
          alt="Venturloop Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-xl mb-1 font-semibold text-gray-800">
          Venturloop
        </span>
      </div>

      {/* Help Button */}
      <button
        onClick={handleHelpClick}
        className="text-sm md:text-base  text-black bg-blue-200 border border-blue-600 hover:border-blue-700 px-4 py-1 rounded-lg transition duration-200"
      >
        Help
      </button>
    </header>
  );
};

export default Navbar;
