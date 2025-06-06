'use client';

import React, { Suspense } from 'react';
import Layout from '@/components/Layout';
import Slider from '@/components/Slider';
import CreatePasswordForm from '@/components/CreatePasswordForm';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

// Wrapper component for Suspense boundary
const CreatePasswordPageContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <Layout leftContent={<Slider />}>
      <CreatePasswordForm email={email} />
    </Layout>
  );
};

const CreatePasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen justify-center items-center">
          <LoadingSpinner />
        </div>
      }
    >
      <CreatePasswordPageContent />
    </Suspense>
  );
};

export default CreatePasswordPage;
