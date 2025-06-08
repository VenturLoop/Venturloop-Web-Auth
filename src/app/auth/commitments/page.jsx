'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';
import { useAppContext } from '@/context/AppContext';

const CommitmentsPage = () => {
     const {  setUserData } = useAppContext();
  
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = [
    'Already full time in a startup',
    'Ready to go full-time with right co-founder',
    'Ready to go full time next year',
    'No specific startup plan',
    'No Preference',
  ];

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedOption) {
    setError('Please select your commitment level to continue.');
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    // ✅ Save commitment to global userData
    setUserData((prev) => ({
      ...prev,
      commitment: selectedOption,
    }));

    console.log('Selected commitment:', selectedOption);
    router.push('/auth/prior-experience');
  } catch (err) {
    console.error('Failed to save commitment:', err);
    setError('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const sliderData = {
    imageSrc: '/image/ai_splash_screen.png',
    title: 'Your Commitment Level',
    description:
      'Let us know how much time you can dedicate. This helps us personalize the opportunities you see.',
  };

  return (
    <SpliteScreen data={sliderData}>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Your Commitment Level
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Choose the option that best reflects your current plan.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedOption(option)}
              className={`w-full flex items-center gap-4 px-6 py-2 rounded-xl border-2 transition-all duration-150 ease-in-out
                ${
                  selectedOption === option
                    ? 'bg-[#c5e2ff] border-[#2983DC] text-[#2983DC] shadow-md scale-[1.02]'
                    : 'bg-white border-gray-300 text-gray-800 hover:border-[#2983DC] hover:bg-blue-50'
                }
                focus:outline-none focus:ring-2 focus:ring-[#2983DC]/50 text-base font-medium`}
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedOption === option
                      ? 'border-white bg-white'
                      : 'border-gray-400'
                  }`}
              >
                {selectedOption === option && (
                  <span className="w-2.5 h-2.5 bg-[#2983DC] rounded-full" />
                )}
              </span>
              {option}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !selectedOption}
          className="w-full bg-[#2983DC] mt-6 hover:bg-[#2270BE] text-white font-semibold py-3 px-6 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:ring-offset-2
            transition duration-150 ease-in-out shadow-md hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </SpliteScreen>
  );
};

export default CommitmentsPage;
