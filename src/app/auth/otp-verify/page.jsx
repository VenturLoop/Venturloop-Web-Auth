'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import OtpForm from '@/components/OtpForm';

const OtpVerifyPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return <OtpForm email={email} />;
};

export default OtpVerifyPage;
