'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import HelpModal from './HelpModal';

const Navbar = () => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleHelpClick = () => {
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-white py-3 px-4 md:px-8 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="https://venturloop.com" passHref legacyBehavior>
          <a className="flex items-center space-x-2 cursor-pointer" target="_blank" rel="noopener noreferrer"> {/* Added target and rel for external link */}
            <Image
              src="/image/appLogoT.png"
              alt="Venturloop Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl mb-1 font-semibold text-gray-800">
              Venturloop
            </span>
          </a>
        </Link>

      {/* Help Button */}
      <button
        onClick={handleHelpClick}
        className="text-sm md:text-base  text-black bg-blue-200 border border-blue-600 hover:border-blue-700 px-4 py-1 rounded-lg transition duration-200"
      >
        Help
      </button>
    </header>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpModalOpen} onClose={closeHelpModal} />
    </>
  );
};

export default Navbar;
