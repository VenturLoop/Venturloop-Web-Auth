'use client';

import React, { useEffect, useState } from 'react';
import { signIn as LogIn, signOut as LogOut, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';
import LoadingSpinner from '../../components/LoadingSpinner';
import { userLogin } from '@/utils/AuthApis';
import { Eye, EyeOff } from 'lucide-react'; // Optional: add this icon lib

const AuthForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // const [lastSeenError, setLastSeenError] = useState(null); // Example for more advanced toast control

  useEffect(() => {
    if (session?.error) {
      let message = 'Login failed. Please try again.';
      console.log("session?.error", session)
      // This is a simplified approach for the subtask.
      // In a full app, you might use a state like lastSeenError to prevent duplicate toasts for the same error instance.
      // Or, the toast library itself might offer de-duplication features.
      switch (session.error) {
        case 'GoogleBackendError':
          message = 'There was a problem connecting to our authentication service. Please try again later.';
          break;
        case 'GoogleIdTokenMissing':
          message = 'Authentication data from the provider was incomplete. Please try again.';
          break;
        case 'OAuthProcessingError':
          message = 'An unexpected error occurred during login. Please try again.';
          break;
        case 'CredentialsLogin': // This error is usually caught by result.error from signIn
          message = 'Invalid email or password.'; // This case might be redundant if signIn handles it
          break;
        default:
          // Use the error string itself if it's unrecognized but present and a string
          if (typeof session.error === 'string') {
            message = `Login failed: ${session.error}`;
          }
          break;
      }
      toast.error(message);
      // Clearing session.error is not directly possible as session object from useSession is read-only in this context.
      // The error will persist in the session until a new session state without an error is received.
    }
  }, [session]);

  const [loadingProvider, setLoadingProvider] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     router.push('https://test.venturloop.com');
  //   }
  // }, [status, router]);

  const handleLogIn = async (provider) => {
    setLoadingProvider(provider);
    try {
      const result = await LogIn(provider, { redirect: false });
      if (result?.error) {
        toast.error(
          result.error === 'CredentialsLogin'
            ? 'Invalid email or password'
            : `Login failed: ${result.error}`
        );
      } else if (result?.ok) {
        toast.success('Logged in successfully!');
      }
    } catch (error) {
      toast.error('Unexpected login error.');
      console.error(error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleCredentialsLogIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoadingProvider('credentials');

    try {
      const result = await userLogin(email, password);
      if (result?.success || result?.token) {
        toast.success('Logged in successfully!');
        localStorage.setItem('token', result.token);
        setEmail('');
        setPassword('');
      } else {
        toast.error(result?.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Unexpected login error.');
      console.error(err);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleLogOut = async () => {
    setLoadingProvider('LogOut');
    toast.loading('Logging out...');
    try {
      await LogOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      console.log(error)
      toast.dismiss();
      toast.error('Unexpected logout error.');
    } finally {
      toast.dismiss();
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
    description: 'Login to access your account and manage everything in one place.',
  };

  return (
    <SpliteScreen data={data}>
      {session ? (
        <div className="text-center">
          <Image
            src={
              session.user.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || session.user.email || 'User')}&background=random&color=fff&size=96`
            }
            alt="User avatar"
            width={96}
            height={96}
            className="rounded-full mx-auto mb-4 border-2 border-indigo-500 shadow-sm"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome, {session.user.name || session.user.email}!
          </h2>
          <p className="text-gray-500 mb-6">You are currently logged in.</p>
          <button
            onClick={handleLogOut}
            disabled={loadingProvider === 'LogOut'}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center shadow-sm disabled:opacity-70 transition duration-150"
          >
            {loadingProvider === 'LogOut' ? <LoadingSpinner size="small" /> : 'Log Out'}
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Login to Venturloop</h2>
          <p className="text-base font-medium text-center text-gray-600 mb-6">
            Login with Google or Email for quick access!
          </p>

          {/* Google Button */}
          <button
            onClick={() => handleLogIn('google')}
            disabled={loadingProvider === 'google'}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center shadow-sm disabled:opacity-70"
          >
            {loadingProvider === 'google' ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0C14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.18-10.45 7.18-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
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

          {/* Email Login Form */}
          <form onSubmit={handleCredentialsLogIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loadingProvider === 'credentials'}
                required
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2983DC] sm:text-sm disabled:bg-gray-50"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loadingProvider === 'credentials'}
                required
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2983DC] sm:text-sm disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-2.5 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loadingProvider === 'credentials'}
              className="w-full bg-[#2983DC] mt-10 hover:bg-[#2576c9] text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2983DC] transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-[#9bc1e4]"
            >
              {loadingProvider === 'credentials' ? <LoadingSpinner size="small" /> : 'Login with Email'}
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
