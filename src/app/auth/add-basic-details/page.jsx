// src/app/auth/add-basic-details/page.jsx
'use client';

import React, { Suspense } from 'react';
import AddBasicDetailsContent from './AddBasicDetailsContent';
import LoadingSpinner from '@/components/LoadingSpinner';
// Using a simple fallback, replace with <LoadingSpinner /> if available and preferred

const AddBasicDetailsPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AddBasicDetailsContent />
    </Suspense>
  );
};

export default AddBasicDetailsPage;
