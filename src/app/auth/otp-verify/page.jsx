'use client';

import React, { Suspense } from 'react';
import SpliteScreen from '@/components/SpliteScreen';
import Slider from '@/components/Slider';
import OtpForm from '@/components/OtpForm';
import { useSearchParams } from 'next/navigation';

const OtpPageContent = () => {
  const searchParams = useSearchParams();
  const email = 'teteatharva@gmail.com';

  const spliteScreenData = {
    imageSrc: '/image/ai_splash_screen.png', // You can customize this image path
    title: 'OTP Verification',
    description: 'Enter the OTP sent to your email to verify your account.',
  };

  return (
    <SpliteScreen leftContent={<Slider />} data={spliteScreenData}>
      <div className="w-full  px-4">
        <OtpForm email={email} />
      </div>
    </SpliteScreen>
  );
};

const OtpVerifyPage = () => <OtpPageContent />;

export default OtpVerifyPage;
