'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const OtpForm = ({ email }) => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      toast.error('Email not provided. Redirecting to signup.');
      router.replace('/signup'); // Use replace to not add to history
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'OTP verified successfully!');
        router.push(`/create-password?email=${encodeURIComponent(email)}`); // Redirect to create-password page
      } else {
        setError(data.message || 'Failed to verify OTP. Please try again.');
        toast.error(data.message || 'Failed to verify OTP. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    // Render nothing or a loading indicator while redirecting
    return (
      <div className="flex justify-center items-center p-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Verify Your Email
      </h2>
      <p className="text-center text-gray-600 mb-6">
        An OTP has been sent to <span className="font-medium">{email}</span>.
        Please enter it below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            One-Time Password (OTP)
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
            } // Allow only digits, max 6
            maxLength="6"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter 6-digit OTP"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-blue-400"
        >
          {isLoading ? <LoadingSpinner /> : 'Verify OTP'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Didn&apos;t receive OTP?{' '}
        <button
          // TODO: Implement resend OTP logic here
          onClick={() => toast.error('Resend OTP not implemented yet.')}
          className="font-medium text-blue-600 hover:text-blue-500"
          disabled={isLoading}
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default OtpForm;
