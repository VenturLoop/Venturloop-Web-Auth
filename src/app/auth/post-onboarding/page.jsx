'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen'; // Changed from Layout
import PostOnboardingContent from '@/components/PostOnboardingContent';
import LoadingSpinner from '@/components/LoadingSpinner';

const PostOnboardingPage = () => {
  const { status } = useSession();
  const router = useRouter();

  // Define slider data for the SpliteScreen component
  const sliderData = {
    imageSrc: '/image/community_splash_screen.png', // Example image, update if needed
    title: 'Welcome Aboard!',
    description: 'Your journey starts now. Connect, collaborate, and create with our vibrant community.',
  };

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen justify-center items-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    // It's better to return null or a loading spinner while redirecting,
    // as router.replace might not immediately stop rendering.
    router.replace('/login');
    return (
        <div className="flex h-screen w-screen justify-center items-center bg-gray-50">
          <LoadingSpinner />
        </div>
      );
  }

  // If authenticated, render the content within the SpliteScreen layout
  return (
    <SpliteScreen data={sliderData}> {/* Use SpliteScreen here */}
      <div className="flex justify-center items-center w-full h-full"> {/* Added flex wrapper for centering PostOnboardingContent */}
        <PostOnboardingContent />
      </div>
    </SpliteScreen>
  );
};

export default PostOnboardingPage;
