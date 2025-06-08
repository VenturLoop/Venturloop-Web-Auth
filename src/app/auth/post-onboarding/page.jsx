'use client';

import React from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';
import PostOnboardingContent from '@/components/PostOnboardingContent';
import { useAppContext } from '@/context/AppContext';

const PostOnboardingPage = () => {
  // const { status } = useSession();
  // const router = useRouter();

  // Slider/left side content for SpliteScreen
  const sliderData = {
    imageSrc: '/image/appView.png',
    title: 'Welcome Aboard!',
    description:
      'Your journey starts now. Connect, collaborate, and create with our vibrant community.',
  };

  // // Handle unauthenticated users
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.replace('/login');
  //   }
  // }, [status, router]);

  // // Show loading while session is being fetched or during redirect
  // if (status === 'loading' || status === 'unauthenticated') {
  //   return (
  //     <div className="flex h-screen w-screen justify-center items-center bg-gray-50">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  // Main content for authenticated users
  return (
    <SpliteScreen imageBig={true} xlScreenSize={true} data={sliderData}>
      <PostOnboardingContent />
    </SpliteScreen>
  );
};

export default PostOnboardingPage;
