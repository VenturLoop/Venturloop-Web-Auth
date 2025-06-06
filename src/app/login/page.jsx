'use client';

import React, { useState } from 'react';
import { LogIn, LogOut, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';

const AuthForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async (provider, credentials = {}) => {
    setLoadingProvider(provider);
    try {
      const result = await LogIn(provider, {
        ...credentials,
        redirect: false,
      });
      if (result?.error) {
        toast.error(
          result.error === 'CredentialsLogin'
            ? 'Invalid email or password'
            : `Log-in failed: ${result.error}`,
        );
      } else if (result?.ok) {
        toast.success('Loged in successfully!');
        if (provider === 'credentials') {
          setEmail('');
          setPassword('');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred during Log-in.');
      console.error('Log-in error:', error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleCredentialsLogIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    handleLogIn('credentials', { email, password });
  };

  const handleLogOut = async () => {
    setLoadingProvider('LogOut');
    toast.loading('Loging out...');
    try {
      await LogOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      toast.dismiss();
      toast.error('An unexpected error occurred during Log-out.');
      console.error('Log-out error:', error);
    } finally {
      setLoadingProvider(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const data = {
    imageSrc: '/image/community_splash_screen.png',
    title: 'Welcome Back!',
    description:
      'Login to access your account and manage everything in one place.',
  };

  return (
    <SpliteScreen data={data}>
      {session ? (
        <div className="text-center">
          <Image
            src={
              session.user.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                session.user.name || session.user.email || 'User',
              )}&background=random&color=fff&size=96`
            }
            alt="User avatar"
            width={96}
            height={96}
            className="rounded-full mx-auto mb-4 border-2 border-indigo-500 shadow-sm"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome, {session.user.name || session.user.email}!
          </h2>
          <p className="text-gray-500 mb-6">You are currently Loged in.</p>
          <button
            onClick={handleLogOut}
            disabled={loadingProvider === 'LogOut'}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center shadow-sm disabled:opacity-70 transition duration-150"
          >
            {loadingProvider === 'LogOut' ? (
              <LoadingSpinner size="small" />
            ) : (
              'Log Out'
            )}
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Login to Venturloop
          </h2>
          <p className="text-base font-medium text-center text-gray-600 mb-6">
            Login with Google, LinkedIn or Email for quick access!
          </p>

          {/* LinkedIn Button */}
          <button
            onClick={() => handleLogIn('linkedin')}
            disabled={loadingProvider === 'linkedin'}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2983DC] transition duration-150 flex items-center justify-center shadow-sm mb-4 disabled:opacity-70"
          >
            {loadingProvider === 'linkedin' ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 24 24"
                  fill="#2983DC"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.127 2.062 2.062 0 0 1 0 4.127zM7.113 20.452H3.561V9h3.552v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
                Continue with LinkedIn
              </>
            )}
          </button>

          {/* Google Button */}
          <button
            onClick={() => handleLogIn('google')}
            disabled={loadingProvider === 'google'}
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleCredentialsLogIn} className="space-y-4">
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
                disabled={loadingProvider === 'credentials'}
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2983DC] sm:text-sm disabled:bg-gray-50"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loadingProvider === 'credentials'}
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2983DC] sm:text-sm disabled:bg-gray-50"
              />
            </div>
            <button
              type="submit"
              disabled={loadingProvider === 'credentials'}
              className="w-full bg-[#2983DC] mt-10 hover:bg-[#2576c9] text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2983DC] transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-[#9bc1e4]"
            >
              {loadingProvider === 'credentials' ? (
                <LoadingSpinner size="small" />
              ) : (
                'Login with Email'
              )}
            </button>
          </form>

          <p className="mt-6 text-center font-medium text-sm text-gray-600">
            Don’t have an account?{' '}
            <button
              onClick={() => router.push('/auth/signup')}
              className="font-medium text-[#2983DC] hover:text-[#2576c9]"
            >
              Sign Up
            </button>
          </p>
        </>
      )}
    </SpliteScreen>
  );
};

export default AuthForm;
