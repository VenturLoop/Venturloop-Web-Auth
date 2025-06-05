'use client'; // This page uses client-side hooks for session and redirection
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import Slider from '@/components/Slider';
import LoadingSpinner from '@/components/LoadingSpinner';


const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.isNewUser) {
        router.replace('/add-basic-details'); // Redirect new users to add details
      } else {
        router.replace('/'); // Redirect existing users to home
      }
    }
  }, [session, status, router]);

  if (status === 'loading' || (status === 'authenticated' && !router.asPath.includes('/add-basic-details'))) {
    // The check for asPath is a bit of a hack to prevent flicker if already redirecting to add-basic-details
    // A more robust solution might involve a dedicated loading page or state management
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
