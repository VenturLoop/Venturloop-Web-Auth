'use client';

import React from 'react';

import CreatePasswordForm from '@/components/CreatePasswordForm';
import { useSearchParams } from 'next/navigation';

const CreatePasswordPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return <CreatePasswordForm email={email} />;
};

export default CreatePasswordPage;
