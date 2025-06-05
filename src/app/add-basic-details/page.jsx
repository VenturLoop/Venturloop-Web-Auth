'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Slider from '@/components/Slider';
import BasicDetailsForm from '@/components/BasicDetailsForm';
import LoadingSpinner from '@/components/LoadingSpinner';

const AddBasicDetailsPage = () => {
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

  // If authenticated, render the form within the layout
  return (
    <Layout leftContent={<Slider />}>
      <BasicDetailsForm />
    </Layout>
  );
};

export default AddBasicDetailsPage;
