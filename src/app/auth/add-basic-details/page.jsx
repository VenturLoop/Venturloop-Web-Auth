'use client';

import React from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

import BasicDetailsForm from '@/components/BasicDetailsForm';
import { useSearchParams } from 'next/navigation';

const AddBasicDetailsPage = () => {
  const searchParams = useSearchParams();

  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const password = searchParams.get('password');

  return <BasicDetailsForm name={name} email={email} password={password} />;
};

export default AddBasicDetailsPage;
