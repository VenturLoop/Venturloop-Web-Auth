'use client';

import React from 'react';
import SignUp from '@/components/SignUp'; // Updated import

const SignupPage = () => {
  // If unauthenticated and not loading, show the signup form
  return <SignUp />; // Updated component
};

export default SignupPage;
