'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';
import { useAppContext } from '@/context/AppContext';

const PriorExperiencePage = () => {
  const { setUserData } = useAppContext();

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = [
    'Sold a startup',
    'Founded/Co-founded a company',
    'Worked in a startup',
    'Previous startup failed',
    'No Prior startup experience',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setError('Please select your startup experience to proceed.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setUserData((prev) => ({
        ...prev,
        priorStartupExperience: selectedOption,
      }));
      console.log('Selected option:', selectedOption);
      router.push('/auth/equity-expectation');
    } catch (err) {
      console.error('Failed to save experience:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sliderData = {
    imageSrc:
      'https://ik.imagekit.io/venturloopimage/miscellaneous/Prior_startup_experience_rMw_CbXL7.jpg?updatedAt=1751276542554',
    title: 'Any Prior Startup Experience',
    description:
      'Your previous exposure to startups helps us tailor opportunities that match your journey.',
  };

  return (
    <SpliteScreen xlScreenSize={false} data={sliderData}>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Any Prior Startup Experience
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Select the option that best describes your startup background.
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

export default PriorExperiencePage;
