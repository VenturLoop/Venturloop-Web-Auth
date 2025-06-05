'use client';

import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
// Toaster is now in Layout.jsx, but individual toasts are triggered here.
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image'; // Import next/image

const AuthForm = () => {
  const { data: session, status } = useSession();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSignIn = async (provider) => {
    setLoadingProvider(provider);
    try {
      const result = await signIn(provider, { redirect: false });
      if (result?.error) {
        toast.error(
          `Sign-in failed: ${result.error === 'CredentialsSignin' ? 'Invalid credentials' : result.error}`,
        );
      } else if (result?.ok) {
        toast.success('Signed in successfully!');
        // Redirect is handled by the page component (e.g., login page or home page)
      }
    } catch (error) {
      toast.error('An unexpected error occurred during sign-in.');
      console.error('Sign-in error:', error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleSignOut = async () => {
    setLoadingProvider('signOut');
    toast.loading('Signing out...'); // Give immediate feedback
    try {
      await signOut({ redirect: true, callbackUrl: '/login' }); // Redirect handled by NextAuth
      // toast.success will likely not be seen due to redirect, this is fine.
    } catch (error) {
      toast.dismiss(); // Dismiss loading toast
      toast.error('An unexpected error occurred during sign-out.');
      console.error('Sign-out error:', error);
    } finally {
      setLoadingProvider(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center p-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      {session ? (
        <div className="text-center">
          <Image
            src={
              session.user.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || session.user.email || 'User')}&background=random&color=fff&size=96`
            }
            alt="User avatar"
            width={96} // Specify width
            height={96} // Specify height
            className="rounded-full mx-auto mb-4 border-2 border-blue-500 shadow-sm"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Welcome, {session.user.name || session.user.email}!
          </h2>
          <p className="text-gray-500 mb-6">You are currently signed in.</p>
          <button
            onClick={handleSignOut}
            disabled={loadingProvider === 'signOut'}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition ease-in-out duration-150 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            {loadingProvider === 'signOut' ? <LoadingSpinner /> : 'Sign Out'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Sign In
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => handleSignIn('google')}
              disabled={loadingProvider === 'google'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition ease-in-out duration-150 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {loadingProvider === 'google' ? (
                <LoadingSpinner />
              ) : (
                <>
                  {/* Basic Google SVG Icon (replace with a proper one if available) */}
                  <svg
                    className="w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.18-10.45 7.18-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
            <button
              onClick={() => handleSignIn('linkedin')}
              disabled={loadingProvider === 'linkedin'}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition ease-in-out duration-150 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {loadingProvider === 'linkedin' ? (
                <LoadingSpinner />
              ) : (
                <>
                  {/* Basic LinkedIn SVG Icon (replace with a proper one if available) */}
                  <svg
                    className="w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.776 13.019H3.561V9h3.552v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path>
                  </svg>
                  Sign in with LinkedIn
                </>
              )}
            </button>
          </div>
          <p className="text-center text-sm text-gray-500">
            Choose your preferred provider to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
