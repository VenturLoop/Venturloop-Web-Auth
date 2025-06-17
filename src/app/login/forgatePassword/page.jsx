// src/app/login/forgatePassword/page.jsx - Corrected comment
'use client';

import React, { Suspense } from 'react'; // Added Suspense
import { useSearchParams } from 'next/navigation';
import ForgatePasswordComponent from '@/components/ForfatePassword'; // Renamed import
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming a loading spinner

// Client component that uses useSearchParams
function ForgatePasswordPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // ForgatePasswordComponent is expected to handle null email
  return <ForgatePasswordComponent email={email} />;
}

// Page component that wraps the client component in Suspense
export default function ForgatePasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}> {/* Or any other fallback UI */}
      <ForgatePasswordPageContent />
    </Suspense>
  );
}
