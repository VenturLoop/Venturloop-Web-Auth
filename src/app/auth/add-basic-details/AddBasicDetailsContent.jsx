// src/app/auth/add-basic-details/AddBasicDetailsContent.jsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import BasicDetailsForm from '@/components/BasicDetailsForm';
// Assuming LoadingSpinner path is correct, adjust if necessary
// import LoadingSpinner from '@/components/LoadingSpinner';

export default function AddBasicDetailsContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const password = searchParams.get('password');

  // It's good practice to handle cases where params might be missing,
  // though BasicDetailsForm might already do this.
  // For now, we pass them as they are.
  // Example:
  // if (!name || !email || !password) {
  //   return <p>Required information is missing from the URL.</p>;
  // }

  return <BasicDetailsForm name={name} email={email} password={password} />;
}
