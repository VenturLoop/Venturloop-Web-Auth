// src/app/auth/otp-verify/page.jsx
'use client';

import React, { Suspense } from 'react';
import OtpVerifyContent from './OtpVerifyContent';
// Using a simple fallback, replace with <LoadingSpinner /> if available and preferred
const SimpleLoadingFallback = () => <div className="flex justify-center items-center h-screen w-screen"><p>Loading...</p></div>;

const OtpVerifyPage = () => {
  return (
    <Suspense fallback={<SimpleLoadingFallback />}>
      <OtpVerifyContent />
    </Suspense>
  );
};

export default OtpVerifyPage;
