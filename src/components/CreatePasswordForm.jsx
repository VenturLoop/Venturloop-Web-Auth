'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Install @heroicons/react if not
import SpliteScreen from './SpliteScreen';

const CreatePasswordForm = ({ email }) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   if (!email) {
  //     toast.error('Email not provided. Redirecting to signup.');
  //     router.replace('/auth/signup');
  //   }
  // }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      toast.error('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Password created successfully!');
        router.push(
          `/auth/add-basic-details?email=${encodeURIComponent(email)}`,
        );
      } else {
        setError(data.message || 'Registration failed.');
        toast.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred.');
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex justify-center items-center p-10">
        <LoadingSpinner />
      </div>
    );
  }
const data = {
    imageSrc: '/image/ai_splash_screen.png', // You can customize this image path
  title: 'Create Password',
  description: 'Set a strong password to secure your account and proceed.',
};


  return (
    <SpliteScreen data={data}>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Create Your Password
        </h2>
        <p className="text-center text-gray-800 font-medium mb-6">
          Setting password for{' '}
          <span className="font-medium text-[#2983DC]">{email}</span>
        </p>

        <form
          onSubmit={() => {
            // handleSubmit()
            router.push(
              `/auth/add-basic-details?email=${encodeURIComponent(email)}`,
            );
          }}
          className="space-y-6"
        >
          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-base font-medium text-gray-700 mb-2"
            >
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:border-[#2983DC] disabled:opacity-50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-11 right-3 text-gray-500 hover:text-[#2983DC] focus:outline-none"
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
            <label
              htmlFor="confirmPassword"
              className="block text-base font-medium text-gray-700 mb-2"
            >
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:border-[#2983DC] disabled:opacity-50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-11 right-3 text-gray-500 hover:text-[#2983DC] focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-base text-red-600 text-center">{error}</p>}

          {/* Submit */}
          <button
            // type="submit"
            type="button"
            onClick={() => {
              router.push(
                `/auth/add-basic-details?email=${encodeURIComponent(email)}`,
              );
            }}
            disabled={isLoading}
            className="w-full flex mt-10 justify-center items-center bg-[#2983DC] hover:bg-[#2474c4] text-lg text-white font-medium py-3 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2983DC] disabled:bg-[#7ab7e6]"
          >
            {isLoading ? <LoadingSpinner /> : 'Create Password'}
          </button>
        </form>
    </SpliteScreen>
  );
};

export default CreatePasswordForm;
