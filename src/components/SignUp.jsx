'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast'; // Added Toaster
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Please enter both name and email.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Assuming the terms checkbox needs to be checked
    const termsChecked = document.getElementById('terms')?.checked;
    if (!termsChecked) {
      toast.error('You must agree to the Terms of Service and Privacy Policy.');
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
    // Assuming the terms checkbox needs to be checked for social signup too
    const termsChecked = document.getElementById('terms')?.checked;
    if (!termsChecked) {
      toast.error(
        'You must agree to the Terms of Service and Privacy Policy before signing up.',
      );
      return;
    }

    setLoadingProvider(provider);
    try {
      const result = await signIn(provider, { redirect: false });
      if (result?.error) {
        toast.error(`Sign-up with ${provider} failed: ${result.error}`);
      } else if (result?.ok) {
        // Redirect is handled by /app/api/auth/[...nextauth]/route.js callbackUrl
        // toast.success(`Signed up with ${provider} successfully!`); // Avoid double toast if redirect happens fast
      }
    } catch (error) {
      toast.error('An unexpected error occurred during sign-up.');
      console.error('Social sign-up error:', error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col md:flex-row h-screen w-screen bg-white">
        {/* Left Column: Illustration and Text */}
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 xl:w-1/2 bg-gray-100 flex-col justify-center items-center p-8 text-center">
          <Image
            src="/images/illustration.png"
            alt="Illustration"
            width={384} // max-w-sm roughly translates to 384px
            height={216} // Assuming 16:9 aspect ratio for the illustration
            className="max-w-sm mx-auto mb-8"
            priority // Optional: if it's LCP
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Find ideal co-founder for your startup
          </h1>
          <p className="text-lg text-gray-600">
            Get daily smart recommendations based on your skills and interests.
          </p>
        </div>

        {/* Right Column: Form Area */}
        <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Sign up with Google, LinkedIn or Email for quick access!
            </p>

            {/* Social Logins */}
            <button
              onClick={() => handleSocialSignup('linkedin')}
              disabled={loadingProvider === 'linkedin' || isEmailLoading}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 flex items-center justify-center shadow-sm mb-3 disabled:opacity-70"
            >
              {loadingProvider === 'linkedin' ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.127 2.062 2.062 0 0 1 0 4.127zM7.113 20.452H3.561V9h3.552v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                  Continue with LinkedIn
                </>
              )}
            </button>
            <button
              onClick={() => handleSocialSignup('google')}
              disabled={loadingProvider === 'google' || isEmailLoading}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 flex items-center justify-center shadow-sm disabled:opacity-70"
            >
              {loadingProvider === 'google' ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-3"
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
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

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
                  disabled={isEmailLoading || loadingProvider}
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50"
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
                  disabled={isEmailLoading || loadingProvider}
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50"
                />
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-center mt-4 mb-4">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isEmailLoading || loadingProvider}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-indigo-400"
              >
                {isEmailLoading ? <LoadingSpinner size="small" /> : 'Continue'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
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
      </div>
    </>
  );
};

export default SignUp;
