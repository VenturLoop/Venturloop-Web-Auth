'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen'; // Corrected path

const CommitmentsPage = () => {
  const router = useRouter();
  const [selectedCommitment, setSelectedCommitment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const commitments = [
    { id: 'full-time', label: 'Full-time (40+ hours/week)' },
    { id: 'part-time', label: 'Part-time (20-30 hours/week)' },
    { id: 'flexible', label: 'Flexible (Less than 20 hours/week)' },
    { id: 'weekend', label: 'Weekends only' },
    { id: 'undecided', label: 'Still Deciding' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCommitment) {
      setError('Please select a commitment level.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual API call logic
      // await updateUserCommitments({ commitment: selectedCommitment });
      console.log('Selected commitment:', selectedCommitment);
      router.push('/auth/prior-experience'); // Navigate to the next step
    } catch (err) {
      console.error('Failed to save commitment:', err);
      setError(
        err.message || 'An error occurred while saving your commitment.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sliderData = {
    imageSrc: '/image/ai_splash_screen.png', // Example image, replace as needed
    title: 'Your Commitment Level',
    description:
      'Tell us about your availability. This helps us match you with the right opportunities.',
  };

  return (
    <SpliteScreen data={sliderData}>
      <div className="w-full max-w-lg px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          What&apos;s Your Commitment?
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Choose the option that best describes your availability.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {commitments.map((commitment) => (
              <button
                key={commitment.id}
                type="button"
                onClick={() => setSelectedCommitment(commitment.id)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-150 ease-in-out
                                ${
                                  selectedCommitment === commitment.id
                                    ? 'bg-green-500 border-green-600 text-white shadow-lg scale-105'
                                    : 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700'
                                }
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
              >
                <span className="font-medium">{commitment.label}</span>
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedCommitment}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                           transition duration-150 ease-in-out shadow-md hover:shadow-lg
                           disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()} // Or a specific previous page
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            &larr; Go Back
          </button>
        </div>
      </div>
    </SpliteScreen>
  );
};

export default CommitmentsPage;
