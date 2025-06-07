'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';

const InterestsPage = () => {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const interestsOptions = [
    'AI/ML', 'AR/VR', 'Advertising', 'Agritech', 'Analysis', 'AudioTech', 'Auto Tech',
    'BioTech', 'ClimateTech/CleanTech', 'Cloud Infrastructure', 'ConstructionTech',
    'Creator/Passion Economy', 'Data Services', 'DeepTech', 'Developer Tools',
    'AgriTech', 'CleanTech', 'LegalTech', 'GovTech', 'ClimateTech', 'SportsTech',
    'MarTech', 'PropTech', 'Marketplace Building', 'Community-led Growth',
    'Cold Outreach Expert', 'Email Marketing', 'Conversion Rate Optimization',
    'Landing Page Expert', 'UI Performance Optimization', 'Accessibility Expert',
    'Localization Specialist', 'Translation', 'Investor Relations', 'Startup Advisor',
    'Startup Consultant', 'Startup Generalist', 'Serial Entrepreneur', 'Startup Evangelist',
    'Early Stage Specialist', 'Incubator Coach', 'Accelerator Lead', 'Leadership',
    'Public Speaking', 'Pitching', 'Negotiation', 'Problem Solving', 'Time Management',
    'Critical Thinking', 'Storytelling', 'Resilience', 'Empathy',
  ];

  const handleToggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Selected interests:', selectedInterests);
      router.push('/auth/commitments');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInterests = interestsOptions.filter((interest) =>
    interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sliderData = {
    imageSrc: '/image/Cofounder_splash_screen.png',
    title: 'Share Your Interests',
    description:
      'Let us know what areas you are passionate about. This helps in finding like-minded individuals and projects.',
  };

  return (
    <SpliteScreen xlScreenSize={true} data={sliderData}>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        What Are Your Interests?
      </h2>
      <p className="text-gray-600 mb-4 text-center">
        Select industries you&apos;re most interested in.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Search interests..."
        value={searchQuery}
        autoFocus
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1">
          {filteredInterests.length > 0 ? (
            filteredInterests.map((interest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleToggleInterest(interest)}
                className={`text-left px-4 py-2 rounded-full border-2 text-xs sm:text-sm transition
                  ${
                    selectedInterests.includes(interest)
                      ? 'bg-[#9fcefc] border-[#2983DC] text-black shadow ring-2 ring-[#2983DC]'
                      : 'bg-white border-gray-300 hover:border-[#2983DC] hover:bg-white text-gray-700'
                  }`}
              >
                {interest}
              </button>
            ))
          ) : (
            <p className="col-span-full text-sm text-center text-gray-400">
              No interests found.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || selectedInterests.length === 0}
          className="w-full bg-[#2983DC] hover:bg-[#2472c1] text-white font-semibold py-3 px-6 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:ring-offset-2
            transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </SpliteScreen>
  );
};

export default InterestsPage;
