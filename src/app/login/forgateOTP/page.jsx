// src/app/auth/create-password/CreatePasswordContent.jsx
'use client';

import ForgateOTPComponent from '@/components/ForgateOTP'; // Renamed import for clarity
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'; // Added Suspense
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming a loading spinner component

// Client component that uses useSearchParams
function ForgateOTPContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return <ForgateOTPComponent email={email} />;
}

// Page component that wraps the client component in Suspense
export default function ForgateOTPScreen() {
  return (
    <Suspense fallback={<LoadingSpinner />}> {/* Or any other fallback UI */}
      <ForgateOTPContent />
    </Suspense>
  );
}
