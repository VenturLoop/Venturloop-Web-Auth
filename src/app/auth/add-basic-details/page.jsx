'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import BasicDetailsForm from '@/components/BasicDetailsForm';


const AddBasicDetailsPage = () => {
  const { status } = useSession(); // session data not directly used
  const router = useRouter();
  const email = 'teteatharva@gmail.com';

  //
  // if (status === 'loading') {
  //   return (
  //     <div className="flex h-screen w-screen justify-center items-center">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  // if (status === 'unauthenticated') {
  //   router.replace('/login'); // Redirect to login if not authenticated
  //   return (
  //     // Render null or a loading spinner while redirecting
  //     <div className="flex h-screen w-screen justify-center items-center">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  // If authenticated, render the form within the layout
  return <BasicDetailsForm email={email} />;
};

export default AddBasicDetailsPage;
