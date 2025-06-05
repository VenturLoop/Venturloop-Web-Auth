'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Redirect unauthenticated users
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
    } catch (error) {
      toast.dismiss();
      toast.error('Sign out failed. Please try again.');
      console.error('Sign out error:', error);
      setIsSigningOut(false);
    }
  };

  // Show loading while session is being determined
  if (
    status === 'loading' ||
    (status === 'unauthenticated' && typeof window !== 'undefined')
  ) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Authenticated user dashboard
  if (session) {
    const avatarUrl =
      session.user.image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        session.user.name || session.user.email || 'User',
      )}&background=0D8ABC&color=fff&size=128&bold=true`;

    return (
      <>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex flex-col items-center justify-center p-6">
          <div className="bg-white p-10 md:p-12 rounded-2xl shadow-xl text-center max-w-lg w-full transition-transform hover:scale-[1.03] duration-300">
            <Image
              src={avatarUrl}
              alt="User avatar"
              width={64}
              height={64}
              className="rounded-full mx-auto mb-6 border-4 border-blue-500 shadow-md"
              priority
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back,
            </h1>
            <p className="text-xl font-medium text-blue-600 mb-4">
              {session.user?.name || session.user?.email}!
            </p>
            <p className="text-sm text-gray-600 mb-8">
              You’ve successfully accessed your personalized dashboard.
            </p>

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-150 flex items-center justify-center shadow-md hover:shadow-lg text-lg"
            >
              {isSigningOut ? <LoadingSpinner /> : 'Sign Out'}
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Powered by <span className="font-medium">NextAuth.js</span> &{' '}
            <span className="font-medium">Venturloop</span>
          </p>
        </div>
      </>
    );
  }

  // Fallback for SSR when session is not available
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-500 text-sm">Preparing your page...</p>
    </div>
  );
}
