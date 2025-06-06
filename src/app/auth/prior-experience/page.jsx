'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen'; // Corrected path
import { updateUserExperience } from '@/utils/AuthApis'; // Assuming this API utility exists

const PriorExperiencePage = () => {
  const router = useRouter();
  const [selectedExperience, setSelectedExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const experiences = [
    { id: 'student', label: 'Student / No Professional Experience' },
    { id: 'entry-level', label: 'Entry-level (0-2 years)' },
    { id: 'mid-level', label: 'Mid-level (2-5 years)' },
    { id: 'senior-level', label: 'Senior-level (5-10 years)' },
    { id: 'expert-level', label: 'Expert / Lead (10+ years)' },
    { id: 'founder', label: 'Previous Founder / Entrepreneur' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExperience) {
      setError('Please select your experience level.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual API call logic
      // await updateUserExperience({ experience: selectedExperience });
      console.log('Selected experience:', selectedExperience);
      router.push('/auth/intrests'); // Navigate to the next step
    } catch (err) {
      console.error('Failed to save experience:', err);
      setError(
        err.message || 'An error occurred while saving your experience.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sliderData = {
    imageSrc: '/image/community_splash_screen.png', // Example image, replace as needed
    title: 'Your Experience Level',
    description:
      'Sharing your experience helps us tailor your journey and find relevant connections.',
  };

  return (
    <SpliteScreen data={sliderData}>
      <div className="w-full max-w-lg px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          What&apos;s Your Experience Level?
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Let us know about your professional background.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {experiences.map((experience) => (
              <button
                key={experience.id}
                type="button"
                onClick={() => setSelectedExperience(experience.id)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-150 ease-in-out
                                ${
                                  selectedExperience === experience.id
                                    ? 'bg-blue-500 border-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                <span className="font-medium">{experience.label}</span>
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedExperience}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
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

export default PriorExperiencePage;
