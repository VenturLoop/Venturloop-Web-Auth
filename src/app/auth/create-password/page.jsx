'use client';

import React, { Suspense } from 'react'; // Ensure React is imported
import Layout from '@/components/Layout';
import Slider from '@/components/Slider';
import CreatePasswordForm from '@/components/CreatePasswordForm';
import { useSearchParams } from 'next/navigation';

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
    <Layout leftContent={<Slider />}>
      <Suspense fallback={<p>Loading page...</p>}>
        <CreatePasswordPageContent />
      </Suspense>
    </Layout>
  );
};

export default CreatePasswordPage;
