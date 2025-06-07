'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGooglePlay } from 'react-icons/fa';
import { BsCheckCircle } from 'react-icons/bs';

const PostOnboardingContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Optional: Redirect if unauthenticated
  // if (status === 'loading' || !session) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 px-4">
      <div className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 text-center animate-fade-in-up">

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <BsCheckCircle className="text-[#34D399] text-5xl mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2983DC]">
            Welcome to the Venturloop Community!
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Your profile is all set. Let’s explore what’s next.
          </p>
        </div>

        {/* Google Play Button */}
        <div className="w-full mb-8">
          <a
            href="#"
            className="flex items-center justify-center bg-[#2b86b4] hover:bg-[#2d6b8c] text-white font-medium py-3 px-5 rounded-lg transition duration-150 shadow-lg"
          >
            <FaGooglePlay className="text-xl mr-2" />
            <span>Get it on Google Play</span>
          </a>
        </div>

        {/* Info Box */}
        <div className="bg-[#E6F1FB] border-l-4 border-[#2983DC] text-[#1c4e7e] p-4 rounded-lg mb-8">
          <p className="font-medium text-sm sm:text-base">
            🎉 You now have early access to new features, fast-track support, and exclusive tools to grow with us.
          </p>
        </div>

        {/* Continue to Web */}
        <button
          onClick={() => router.push('/')}
          className="w-full bg-[#2983DC] hover:bg-[#2270BE] text-white font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-md hover:shadow-xl text-lg"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PostOnboardingContent;
