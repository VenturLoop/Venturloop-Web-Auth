'use client';

import React from 'react';
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
      <CreatePasswordPageContent />
    </Layout>
  );
};

export default CreatePasswordPage;
