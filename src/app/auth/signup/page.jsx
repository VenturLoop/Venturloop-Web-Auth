'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SignUp from '@/components/SignUp'; // Updated import
import LoadingSpinner from '@/components/LoadingSpinner';

const SignupPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.isNewUser === true) {
        router.replace('/add-basic-details');
      } else {
        router.replace('/');
      }
    }
  }, [session, status, router]);

  if (status === 'loading' || status === 'authenticated') {
    // Show loading spinner while checking auth or redirecting
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If unauthenticated and not loading, show the signup form
  return <SignUp />; // Updated component
};

export default SignupPage;
