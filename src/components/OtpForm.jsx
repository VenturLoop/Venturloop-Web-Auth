'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import OtpInput from './OTP/OTPInput';

const OtpForm = ({ email }) => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      toast.error('Email not provided. Redirecting to signup...');
      router.replace('/auth/signup');
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const finalOtp = otp.join('');

    if (finalOtp.length !== 6) {
      const message = 'Please enter a valid 6-digit OTP.';
      setError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || 'OTP verified successfully!');
        router.push(`/create-password?email=${encodeURIComponent(email)}`);
      } else {
        const message =
          data.message || 'Failed to verify OTP. Please try again.';
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const message = 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full  px-4 py-6 sm:px-6 lg:px-8 bg-white  rounded-xl">
      <div className="text-center  mb-6">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          Verify Your Email
        </h2>
        <p className="mt-2 text-sm text-gray-800 font-medium">
          We&apos;ve sent a 6-digit code to{' '}
          <span className="font-medium">{email}</span>. Enter it below to
          continue.
        </p>
      </div>

      <form
        onSubmit={() => {
          handleSubmit()
        }}
        className="space-y-6 w-full"
      >
        <div className="my-12">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-4"
          >
            One-Time Password (OTP)
          </label>
          <OtpInput otp={otp} setOtp={setOtp} isLoading={isLoading} />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2983DC] hover:bg-[#2576c9] mt-6 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2576c9] focus:ring-offset-2 transition disabled:bg-[#2576c9]"
        >
          {isLoading ? <LoadingSpinner /> : 'Verify OTP'}
        </button>
      </form>

      <div className="mt-6 font-medium text-center text-sm text-gray-700">
        Didn&apos;t receive the OTP?{' '}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => toast.error('Resend OTP not implemented yet.')}
          className="text-[#2983DC] hover:text-[#2576c9] font-medium transition"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

OtpForm.propTypes = {
  email: PropTypes.string.isRequired,
};

export default OtpForm;
