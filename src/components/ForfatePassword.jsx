'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';
import SpliteScreen from './SpliteScreen';
import { ConfirmPassword } from '@/utils/AuthApis'; // Changed import

const ForgatePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Redirecting...');
      router.push('/login/forgateEmail');
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      return toast.error('Please fill in both password fields.');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    setIsLoading(true);
    try {
      // Call the corrected API function with appropriate arguments
      const response = await ConfirmPassword(email, password);

      if (response.success) {
        toast.success(response.message || 'Password reset successfully!');
        router.push('/login');
      } else {
        toast.error(response.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const data = {
    imageSrc:
      'https://ik.imagekit.io/venturloopimage/miscellaneous/Create_password_Forget_password_QGguGvvWrf.jpg?updatedAt=1751276670520',
    title: 'Create Password',
    description: 'Set a strong password to secure your account and proceed.',
  };

  return (
    <SpliteScreen data={data}>
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Create Your Password
      </h2>
      <p className="text-center text-gray-800 font-medium mb-6">
        Setting password for <span className="text-[#2983DC]">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Field */}
        <div className="relative">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-md pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-11 right-3"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="block mb-2 font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Confirm your password"
            className="w-full px-4 py-2 border rounded-md pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute top-11 right-3"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2983DC] text-white py-3 rounded-md font-medium mt-4"
        >
          {isLoading ? <LoadingSpinner /> : 'Create Password'}
        </button>
      </form>
    </SpliteScreen>
  );
};

export default ForgatePassword;
