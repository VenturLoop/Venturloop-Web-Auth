// src/app/auth/create-password/CreatePasswordContent.jsx
'use client';

import ForgateEmail from '@/components/ForgateEmail';
import ForgateOTP from '@/components/ForgateOTP';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function ForgateOTPScreen() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return <ForgateOTP email={email} />;
}
