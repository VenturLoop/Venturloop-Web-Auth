'use client';

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
// Toaster is now in Layout.jsx, and also in AuthForm.jsx if needed there.
// For this page, global Toaster in RootLayout or specific page Layout should suffice.
// However, if direct toast calls are made (like for signout), having one available is good.
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image'; // Import next/image

export const metadata = {
  title: 'Dashboard', // Will be "Dashboard | Venturloop Auth"
  description:
    'Your personalized Venturloop dashboard. View your account details and manage settings.',
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    toast.loading('Signing out...');
    try {
      await signOut({ redirect: true, callbackUrl: '/login' });
      // toast.success('Signed out successfully!'); // Won't be seen due to redirect
    } catch (error) {
      toast.dismiss();
      toast.error('Sign out failed. Please try again.');
      console.error('Sign out error:', error);
    } finally {
      // In case of error, or if redirect takes time.
      setIsSigningOut(false);
    }
  };

  if (
    status === 'loading' ||
    (status === 'unauthenticated' && typeof window !== 'undefined')
  ) {
    // Show loading spinner if session is loading or if unauthenticated (client-side only)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (session) {
    return (
      <>
        {/* Page-specific Toaster if needed, or rely on Layout's Toaster */}
        <Toaster position="top-center" reverseOrder={false} />
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl text-center max-w-lg w-full transform transition-all hover:scale-105 duration-300">
            <Image
              src={
                session.user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || session.user.email || 'User')}&background=0D8ABC&color=fff&size=128&font-size=0.5&bold=true`
              }
              alt="User avatar"
              width={128} // Matched to size in URL
              height={128} // Matched to size in URL
              className="rounded-full mx-auto mb-6 border-4 border-blue-500 shadow-lg"
              priority // Prioritize loading the user's avatar on their dashboard
            />
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800">
              Welcome back,
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-blue-600 mb-6">
              {session.user?.name || session.user?.email}!
            </p>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              You have successfully accessed your personalized dashboard.
            </p>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition ease-in-out duration-150 flex items-center justify-center shadow-md hover:shadow-lg text-lg"
            >
              {isSigningOut ? <LoadingSpinner /> : 'Sign Out'}
            </button>
          </div>
          <p className="mt-8 text-gray-500 text-sm">
            Powered by NextAuth.js & Venturloop
          </p>
        </div>
      </>
    );
  }

  // Fallback for server-side rendering when unauthenticated, useEffect handles client-side.
  // Or if status is neither loading, unauthenticated, nor authenticated.
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-500">Preparing your page...</p>
    </div>
  );
}
