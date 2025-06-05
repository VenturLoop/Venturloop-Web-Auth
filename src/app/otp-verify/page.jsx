'use client';

import React, { Suspense } from 'react'; // Import Suspense
import Layout from '@/components/Layout';
import Slider from '@/components/Slider';
import OtpForm from '@/components/OtpForm';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner'; // For Suspense fallback

// A wrapper component to use useSearchParams because it needs to be in a Suspense boundary
const OtpPageContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <Layout leftContent={<Slider />}>
      <OtpForm email={email} />
    </Layout>
  );
};

const OtpVerifyPage = () => {
  return (
    // Wrap the component that uses useSearchParams with Suspense
    <Suspense fallback={<div className="flex h-screen w-screen justify-center items-center"><LoadingSpinner /></div>}>
      <OtpPageContent />
    </Suspense>
  );
};

export default OtpVerifyPage;
