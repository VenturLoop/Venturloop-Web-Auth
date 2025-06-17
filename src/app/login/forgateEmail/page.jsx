// src/app/auth/create-password/CreatePasswordContent.jsx
'use client';

import ForgateEmail from '@/components/ForgateEmail';
import React from 'react';

export default function CreatePasswordContent() {
  // CreatePasswordForm is expected to handle null email (e.g., show loading/error)
  // based on its current implementation.
  return <ForgateEmail />;
}
