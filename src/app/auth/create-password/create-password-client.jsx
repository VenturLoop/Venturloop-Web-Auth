// src/app/auth/create-password/page.jsx
'use client';

import React, { Suspense } from 'react';
import CreatePasswordContent from './CreatePasswordContent';
// Using a simple fallback, replace with <LoadingSpinner /> if available and preferred
const SimpleLoadingFallback = () => <div className="flex justify-center items-center h-screen w-screen"><p>Loading...</p></div>;

const CreatePasswordPage = () => {
  return (
    <Suspense fallback={<SimpleLoadingFallback />}>
      <CreatePasswordContent />
    </Suspense>
  );
};

export default CreatePasswordPage;
