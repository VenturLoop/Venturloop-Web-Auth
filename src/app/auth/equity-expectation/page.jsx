'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';
import { useAppContext } from '@/context/AppContext';
import { submitProfileApi } from '@/utils/AuthApis';

const EquityExpectationPage = () => {
  const { userData, setUserData } = useAppContext();

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [range, setRange] = useState({ min: '', max: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const equityOptions = [
    { id: 'negotiable', label: 'Fully Negotiable' },
    { id: 'equal', label: 'Equal Split' },
    { id: 'accept', label: 'Willing to accept a specific equity range' },
    { id: 'offer', label: 'Willing to offer a specific equity range' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      setError('Please select an option.');
      return;
    }

    if (
      (selectedOption === 'accept' || selectedOption === 'offer') &&
      (!range.min || !range.max)
    ) {
      setError('Please provide both min and max equity values.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const equityExpectation =
        selectedOption === 'accept'
          ? `Accept: Min ${range.min}%, Max ${range.max}%`
          : selectedOption === 'offer'
          ? `Offer: Min ${range.min}%, Max ${range.max}%`
          : selectedOption === 'negotiable'
          ? 'Fully Negotiable'
          : 'Equal Split';

      // Call submitProfileApi with values from context
      const response = await submitProfileApi({
        userId: userData?._id, // Ensure userData includes _id
        skillSet: userData.skillSet,
        industries: userData.industries,
        priorStartupExperience: userData.priorStartupExperience,
        commitmentLevel: userData.commitmentLevel,
        equityExpectation,
        status: userData.status || '',
        profilePhoto: userData.profilePhoto,
      });

      console.log('Profile submitted successfully:', response);
      router.push('/auth/post-onboarding');
    } catch (err) {
      console.error('Error saving preference:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sliderData = {
    imageSrc: '/image/Cofounder_splash_screen.png',
    title: 'Your Equity Expectations',
    description:
      'Let us know your expectations around equity so we can align you with the right roles or partners.',
  };

  return (
    <SpliteScreen xlScreenSize={false} data={sliderData}>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        What&apos;s Your Equity Expectation?
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Choose the option that best matches your equity preference.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          {equityOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedOption(option.id)}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl border-2 text-sm transition
      ${
        selectedOption === option.id
          ? 'bg-[#c5e2ff] border-[#2983DC] text-[#2983DC] shadow-lg scale-[1.02]'
          : 'bg-white border-gray-300 text-gray-700 hover:border-[#2983DC] hover:bg-[#f4f9ff] '
      }
      focus:outline-none focus:ring-2 focus:ring-[#2983DC]`}
            >
              <div
                className={`w-4 h-4 flex-shrink-0 rounded-full border-2 ${
                  selectedOption === option.id
                    ? 'bg-white border-white ring-2 ring-white'
                    : 'border-gray-400'
                }`}
                style={{
                  boxShadow:
                    selectedOption === option.id
                      ? '0 0 0 3px #2563EB' // [#2983DC] outer ring
                      : 'none',
                }}
              />
              <span className="font-medium text-base">{option.label}</span>
            </button>
          ))}

          {(selectedOption === 'accept' || selectedOption === 'offer') && (
            <div className="flex gap-4 ">
              <div className="flex-1">
                <label className="block text-base font-medium mb-1">
                  Min %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 0.5"
                  value={range.min}
                  onChange={(e) =>
                    setRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full border border-gray-400 rounded-lg px-4 py-2 text-base focus:ring-[#2983DC] focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-base font-medium mb-1">
                  Max %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 2.0"
                  value={range.max}
                  onChange={(e) =>
                    setRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full border border-gray-400 rounded-lg px-4 py-2 text-base focus:ring-[#2983DC] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2983DC] hover:bg-[#2270BE] text-white font-semibold py-3 px-6 rounded-lg
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

export default EquityExpectationPage;
