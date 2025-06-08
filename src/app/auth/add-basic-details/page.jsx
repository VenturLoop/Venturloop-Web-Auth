// src/app/auth/add-basic-details/page.jsx
'use client';

import React, { Suspense } from 'react';
import AddBasicDetailsContent from './AddBasicDetailsContent';
// Using a simple fallback, replace with <LoadingSpinner /> if available and preferred
const SimpleLoadingFallback = () => <div className="flex justify-center items-center h-screen w-screen"><p>Loading...</p></div>;

const AddBasicDetailsPage = () => {
  return (
    <Suspense fallback={<SimpleLoadingFallback />}>
      <AddBasicDetailsContent />
    </Suspense>
  );
};

export default AddBasicDetailsPage;
