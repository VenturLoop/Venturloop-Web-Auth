'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import BasicDetailsForm from '@/components/BasicDetailsForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import SpliteScreen from '@/components/SpliteScreen';

const AddBasicDetailsPage = () => {
  const { status } = useSession(); // session data not directly used
  const router = useRouter();
// 
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

  const spliteScreenData = {
  imageSrc: '/image/add_basic_details.png', // Customize the image path
  title: 'Complete Your Profile',
  description: 'Please provide your basic details to complete your account setup.',
};


  // If authenticated, render the form within the layout
  return (
    <SpliteScreen data={spliteScreenData}>
      <BasicDetailsForm />
    </SpliteScreen>
  );
};

export default AddBasicDetailsPage;
