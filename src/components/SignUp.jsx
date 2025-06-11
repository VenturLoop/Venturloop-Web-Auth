'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SpliteScreen from './SpliteScreen';
import LoadingSpinner from './LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { signInwithEmail } from '@/utils/AuthApis'; // Import handleGoogleSignIn
import { signIn, useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Signup() {
  const { setUserData } = useAppContext();
  const { data: session } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loadingProvider, setLoadingProvider] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const router = useRouter();

  const data = {
    imageSrc: '/image/Cofounder_splash_screen.png',
    title: 'Find ideal co-founder for your startup',
    description:
      'Get daily smart recommendations based on your skills and interests.',
  };

  const handleSocialSignup = async (provider, credentials = {}) => {
    setLoadingProvider(provider);

    try {
      const result = await signIn(provider, {
        ...credentials,
        redirect: false, // We'll manually handle the redirect
      });

      if (result?.error) {
        toast.error(
          result.error === 'CredentialsLogin'
            ? 'Invalid email or password'
            : `Login failed: ${result.error}`,
        );
      } else if (result?.ok) {
        toast.success('Login successful!');

        // Fetch the session to check if it's a new user
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        const isNewUser = sessionData?.user?.isNewUser;
        const redirectToAddDetails =
          sessionData?.user?.requiresRedirectToAddBasicDetails;

        if (isNewUser || redirectToAddDetails) {
          router.push('/auth/add-basic-details');
        } else {
          router.push('/login'); // Change this to `/dashboard` or other page if needed
        }

        // Optional cleanup for credentials
        if (provider === 'credentials') {
          setEmail('');
          setPassword('');
        }
      }
    } catch (error) {
      toast.error('Unexpected login error.');
      console.error(error);
    } finally {
      setLoadingProvider(null);
    }
  };
  useEffect(() => {
    let countdownInterval;

    const checkAndRedirect = async () => {
      if (!session) return;

      try {
        const res = await fetch('/api/auth/session');
        const sessionData = await res.json();
        const isNewUser = sessionData?.user?.isNewUser;
        const redirectToAddDetails =
          sessionData?.user?.requiresRedirectToAddBasicDetails;

        setUserData((prev) => ({
          ...prev,
          name: session?.user?.name,
          email: session?.user?.email,
          profileImageUrl:
            session?.user?.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              session?.user?.name || session?.user?.email || 'User',
            )}&background=random&color=fff&size=96`,
        }));

        // Start countdown
        countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              if (isNewUser || redirectToAddDetails) {
                router.push('/auth/add-basic-details');
              } else {
                router.push('/login'); // or /dashboard
              }
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch session for redirection', err);
      }
    };

    checkAndRedirect();

    return () => clearInterval(countdownInterval);
  }, [session]);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setIsEmailLoading(true);

    try {
      const response = await signInwithEmail({ name, email });

      if (response?.success) {
        setUserData((prev) => ({ ...prev, name: name, email: email }));
        // Optional: Store email or response in localStorage or context
        router.push(`/auth/otp-verify?email=${encodeURIComponent(email)}`); // Redirect to OTP verify page
      } else {
        alert(response?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong while sending OTP');
    } finally {
      setIsEmailLoading(false);
    }
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
          <p className="text-gray-500 mb-6">
            Your account is created. Redirecting in{' '}
            <span className="font-semibold text-gray-700">{countdown}</span>{' '}
            seconds...
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-base font-medium text-center text-gray-600 mb-6">
            Sign up with Google, LinkedIn or Email for quick access!
          </p>

          {/* LinkedIn Button */}
          <button
            onClick={() => handleSocialSignup('linkedin')}
            disabled={loadingProvider === 'linkedin' || isEmailLoading}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2983DC] transition duration-150 flex items-center justify-center shadow-sm mb-4 disabled:opacity-70"
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
            onClick={() => handleSocialSignup('google')}
            disabled={loadingProvider === 'google' || isEmailLoading}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 flex items-center justify-center shadow-sm disabled:opacity-70"
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
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2983DC] sm:text-sm disabled:bg-gray-50"
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
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2983DC] sm:text-sm disabled:bg-gray-50"
              />
            </div>

            <div className="flex items-center mt-5 mb-6">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#2983DC] border-gray-300 rounded focus:ring-[#2983DC]"
              />
              <label
                htmlFor="terms"
                className="ml-2 font-medium block text-sm text-gray-700"
              >
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="font-medium text-[#2983DC] hover:text-[#2576c9]"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="font-medium text-[#2983DC] hover:text-[#2576c9]"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isEmailLoading || loadingProvider}
              className="w-full bg-[#2983DC] mt-10 hover:bg-[#2576c9] text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2983DC] transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-[#9bc1e4]"
            >
              {isEmailLoading ? <LoadingSpinner size="small" /> : 'Continue'}
            </button>
          </form>

          <p className="mt-6 text-center font-medium text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-[#2983DC] hover:text-[#2576c9]"
            >
              Log In
            </Link>
          </p>
        </>
      )}
    </SpliteScreen>
  );
}
