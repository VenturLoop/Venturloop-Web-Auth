'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import SpliteScreen from './SpliteScreen';

const ForgateEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Redirect with email as query param
    router.push(`/login/forgateOTP?email=${encodeURIComponent(email)}`);
  };

  const data = {
    imageSrc: '/image/ai_splash_screen.png',
    title: 'Forgate Password',
    description: 'Set a strong password to secure your account and proceed.',
  };

  return (
    <SpliteScreen data={data}>
      <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#2983DC] mt-5 text-white py-2 rounded-md font-semibold hover:bg-[#2471c7]"
        >
          Continue
        </button>
      </form>
    </SpliteScreen>
  );
};

export default ForgateEmail;
