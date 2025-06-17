// src/app/auth/create-password/page.jsx
'use client';

import React, { Suspense } from 'react';
import CreatePasswordContent from './CreatePasswordContent';
import LoadingSpinner from '@/components/LoadingSpinner';
// Using a simple fallback, replace with <LoadingSpinner /> if available and preferred

const CreatePasswordPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreatePasswordContent />
    </Suspense>
  );
};

export default CreatePasswordPage;
