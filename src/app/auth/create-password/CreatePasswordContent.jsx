// src/app/auth/create-password/CreatePasswordContent.jsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import CreatePasswordForm from '@/components/CreatePasswordForm';

export default function CreatePasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // CreatePasswordForm is expected to handle null email (e.g., show loading/error)
  // based on its current implementation.
  return <CreatePasswordForm email={email} />;
}
