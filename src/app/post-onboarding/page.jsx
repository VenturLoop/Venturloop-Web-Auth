'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Slider from '@/components/Slider';
import PostOnboardingContent from '@/components/PostOnboardingContent';
import LoadingSpinner from '@/components/LoadingSpinner';

const PostOnboardingPage = () => {
  const { status } = useSession(); // session data not directly used
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/login'); // Redirect to login if not authenticated
    return (
      // Render null or a loading spinner while redirecting
      <div className="flex h-screen w-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If authenticated, render the content within the layout
  return (
    <Layout leftContent={<Slider />}>
      <PostOnboardingContent />
    </Layout>
  );
};

export default PostOnboardingPage;
