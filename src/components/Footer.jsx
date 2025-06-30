'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white text-gray-600 text-sm py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left space-y-4 md:space-y-0">
        {/* Left Side */}
        <div className="mb-4 md:mb-0">
          © 2025 Venturloop App. All rights reserved.
        </div>

        {/* Increased spacing between links for better touch targets on mobile, and centered them on mobile */}
        <div className="flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6">
          <Link
            href="https://web.venturloop.com/privacy-policy"
            className="hover:underline text-sm font-medium text-gray-700 mb-2 sm:mb-0" // Added margin bottom for wrapped items
          >
            Privacy Policy
          </Link>
          <Link
            href="https://web.venturloop.com/terms-conditions"
            className="hover:underline text-sm font-medium text-gray-700 mb-2 sm:mb-0" // Added margin bottom for wrapped items
          >
            Terms of Use
          </Link>
          <Link
            href="https://web.venturloop.com/community-guidelines"
            className="hover:underline text-sm font-medium text-gray-700 mb-2 sm:mb-0" // Added margin bottom for wrapped items
          >
            Community Guidelines
          </Link>
          <Link
            href="https://web.venturloop.com/refund-policy"
            className="hover:underline text-sm font-medium text-gray-700" // Last item doesn't strictly need mb-2
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
