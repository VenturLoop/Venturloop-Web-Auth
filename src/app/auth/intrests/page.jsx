'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen'; // Corrected path

const InterestsPage = () => {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const interestsOptions = [
    { id: 'technology', label: 'Technology (AI, SaaS, Web3)' },
    { id: 'healthcare', label: 'Healthcare & Biotech' },
    { id: 'ecommerce', label: 'E-commerce & Retail' },
    { id: 'education', label: 'Education & EdTech' },
    { id: 'finance', label: 'Finance & FinTech' },
    { id: 'sustainability', label: 'Sustainability & GreenTech' },
    { id: 'media', label: 'Media & Entertainment' },
    { id: 'social', label: 'Social Impact & Non-profit' },
    { id: 'travel', label: 'Travel & Hospitality' },
    { id: 'gaming', label: 'Gaming & eSports' },
  ];

  const handleInterestToggle = (interestId) => {
    setSelectedInterests((prevInterests) =>
      prevInterests.includes(interestId)
        ? prevInterests.filter((id) => id !== interestId)
        : [...prevInterests, interestId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }
    // Allow selection of up to 3 interests
    if (selectedInterests.length > 3) {
      setError('You can select up to 3 interests.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual API call logic
      // await updateUserInterests({ interests: selectedInterests });
      console.log('Selected interests:', selectedInterests);
      router.push('/auth/skillset'); // Navigate to the next step
    } catch (err) {
      console.error('Failed to save interests:', err);
      setError(
        err.message || 'An error occurred while saving your interests.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sliderData = {
    imageSrc: '/image/Cofounder_splash_screen.png', // Example image, replace as needed
    title: 'Share Your Interests',
    description:
      'Let us know what areas you are passionate about. This helps in finding like-minded individuals and projects.',
  };

  return (
    <SpliteScreen data={sliderData}>
      <div className="w-full max-w-lg px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          What Are Your Interests?
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Select up to 3 areas you&apos;re most interested in.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interestsOptions.map((interest) => (
              <button
                key={interest.id}
                type="button"
                onClick={() => handleInterestToggle(interest.id)}
                className={`w-full text-left px-5 py-3.5 rounded-lg border-2 transition-all duration-150 ease-in-out text-sm
                                ${
                                  selectedInterests.includes(interest.id)
                                    ? 'bg-purple-500 border-purple-600 text-white shadow-lg ring-2 ring-purple-400 ring-offset-1'
                                    : 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50 text-gray-700'
                                }
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
              >
                <span className="font-medium">{interest.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">
            You have selected {selectedInterests.length} of 3 interests.
          </p>

          <button
            type="submit"
            disabled={isLoading || selectedInterests.length === 0 || selectedInterests.length > 3}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                           transition duration-150 ease-in-out shadow-md hover:shadow-lg
                           disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            &larr; Go Back
          </button>
        </div>
      </div>
    </SpliteScreen>
  );
};

export default InterestsPage;
