'use client'; // This page uses client-side hooks for session and redirection
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import Slider from '@/components/Slider';
import LoadingSpinner from '@/components/LoadingSpinner';

export const metadata = {
  title: 'Sign In / Sign Up',
  description:
    'Access your Venturloop account or create a new one. Sign in with Google or LinkedIn.',
};

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/'); // Redirect to home if already logged in
    }
  }, [session, status, router]);

  if (status === 'loading' || status === 'authenticated') {
    // Show a loading spinner while checking session or if redirecting
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated and not loading, show the login page
  return (
    <Layout leftContent={<Slider />}>
      <AuthForm />
    </Layout>
  );
};

export default LoginPage;
