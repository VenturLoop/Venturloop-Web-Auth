'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import LoadingSpinner from './LoadingSpinner';

const SignupForm = () => {
  const router = useRouter(); // Initialize router
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false); // Loading state for email signup
  const [loadingProvider, setLoadingProvider] = useState(null); // For social sign-ups

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Please enter both name and email.');
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsEmailLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message ||
            'OTP sent successfully! Please check your email (or console).',
        );
        router.push(`/otp-verify?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
    setLoadingProvider(provider);
    try {
      const result = await signIn(provider, { redirect: false }); // Redirect will be handled by NextAuth based on callbacks
      if (result?.error) {
        toast.error(`Sign-up with ${provider} failed: ${result.error}`);
      } else if (result?.ok) {
        toast.success(`Signed up with ${provider} successfully!`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred during sign-up.');
      console.error('Social sign-up error:', error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Create Account
      </h2>

      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isEmailLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
          />
        </div>
        <button
          type="submit"
          disabled={isEmailLoading || loadingProvider}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-indigo-400"
        >
          {isEmailLoading ? <LoadingSpinner /> : 'Sign up with Email'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or sign up with</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleSocialSignup('google')}
          disabled={loadingProvider === 'google'}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md"
        >
          {loadingProvider === 'google' ? (
            <LoadingSpinner />
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.18-10.45 7.18-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Sign up with Google
            </>
          )}
        </button>
        <button
          onClick={() => handleSocialSignup('linkedin')}
          disabled={loadingProvider === 'linkedin'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md"
        >
          {loadingProvider === 'linkedin' ? (
            <LoadingSpinner />
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.127 2.062 2.062 0 0 1 0 4.127zM7.113 20.452H3.561V9h3.552v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              Sign up with LinkedIn
            </>
          )}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
