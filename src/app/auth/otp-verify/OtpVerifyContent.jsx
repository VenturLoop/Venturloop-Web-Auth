// src/app/auth/otp-verify/OtpVerifyContent.jsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import OtpForm from '@/components/OtpForm';

export default function OtpVerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // OtpForm is expected to handle null email (e.g., show loading/error)
  // based on its current implementation.
  return <OtpForm email={email} />;
}
