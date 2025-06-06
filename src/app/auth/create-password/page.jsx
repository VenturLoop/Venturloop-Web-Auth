'use client';

import React from 'react';
import Slider from '@/components/Slider';
import CreatePasswordForm from '@/components/CreatePasswordForm';
import { useSearchParams } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';

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

const spliteScreenData = {
  imageSrc: '/image/ai_splash_screen.png', // You can customize this image path
  title: 'OTP Verification',
  description: 'Enter the OTP sent to your email to verify your account.',
};
const CreatePasswordPage = () => {
  return (
    <SpliteScreen data={spliteScreenData}>
      <CreatePasswordPageContent />
    </SpliteScreen>
  );
};

export default CreatePasswordPage;
