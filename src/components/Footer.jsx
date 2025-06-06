'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white text-gray-600 text-sm py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* Left Side */}
        <div>© 2025 Venturloop App. All rights reserved.</div>

        {/* Right Side Links */}
        <div className="flex space-x-6">
          <Link
            href="/privacy-policy"
            className="hover:underline text-sm font-medium text-gray-700"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-use"
            className="hover:underline text-sm font-medium text-gray-700"
          >
            Terms of Use
          </Link>
          <Link
            href="/community-guidelines"
            className="hover:underline text-sm font-medium text-gray-700"
          >
            Community Guidelines
          </Link>
          <Link
            href="/refund-policy"
            className="hover:underline text-sm font-medium text-gray-700"
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
