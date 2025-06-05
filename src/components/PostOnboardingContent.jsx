'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner'; // Assuming this exists and is styled
// You might want to use actual icons for App Store and Google Play buttons
// For example, from react-icons: import { FaApple, FaGooglePlay } from 'react-icons/fa';

const PostOnboardingContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="flex justify-center items-center p-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-200 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-600 mb-6">
        You&apos;re All Set!
      </h1>
      <p className="text-gray-700 mb-8 text-lg">
        Your profile is ready. You can now explore the full features of our
        platform.
      </p>

      <div className="space-y-4 mb-10">
        <a
          href="#" // Placeholder link
          className="flex items-center justify-center w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Download on the App Store"
        >
          {/* <FaApple className="w-6 h-6 mr-2" /> Replace with actual icon */}
          <span className="text-xl"></span>{' '}
          {/* Simple Apple logo placeholder */}
          <span className="ml-2">Download on the App Store</span>
        </a>
        <a
          href="#" // Placeholder link
          className="flex items-center justify-center w-full bg-gray-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-600 transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Get it on Google Play"
        >
          {/* <FaGooglePlay className="w-5 h-5 mr-2" /> Replace with actual icon */}
          <svg
            className="w-6 h-6 mr-2 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21.53,9.21a2.48,2.48,0,0,0-1.29-1.29,2.48,2.48,0,0,0-1.29-1.29L16.47,5.2V5A2.5,2.5,0,0,0,14,2.5H10A2.5,2.5,0,0,0,7.5,5v.2L5.08,6.63a2.48,2.48,0,0,0-1.29,1.29A2.48,2.48,0,0,0,2.5,9.21V14.8a2.48,2.48,0,0,0,1.29,1.29,2.48,2.48,0,0,0,1.29,1.29l2.42,1.44V19a2.5,2.5,0,0,0,2.5,2.5h4a2.5,2.5,0,0,0,2.5-2.5v-.2l2.42-1.44a2.48,2.48,0,0,0,1.29-1.29,2.48,2.48,0,0,0,1.29-1.29V9.21ZM9.88,16.43l-4.3-2.48,4.3-2.48Zm1.25,1.25L6.88,15.2,11.13,12.72l4.25,2.48Zm0-5L6.88,10.2,11.13,7.72l4.25,2.48Zm0-5L6.88,5.2,11.13,2.72l4.25,2.48Zm6.75,7.18L13.63,17.11V7.89l4.25-2.48Z" />
          </svg>
          <span className="ml-1">Get it on Google Play</span>
        </a>
      </div>

      <button
        onClick={() => router.push('/')}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 shadow-lg hover:shadow-xl text-lg"
      >
        Continue to Web
      </button>
    </div>
  );
};

export default PostOnboardingContent;
