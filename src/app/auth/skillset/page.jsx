'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen';

const SkillsetPage = () => {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const skillsOptions = [
    'Web Developer',
    'App Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'iOS Developer',
    'Android Developer',
    'React Developer',
    'React Native Developer',
    'Node.js Developer',
    'Python Developer',
    'Java Developer',
    'C++ Developer',
    'Software Engineer',
    'Game Developer',
    'AR/VR Developer',
    'Unity Developer',
    'Web Developer',
    'App Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'iOS Developer',
    'Android Developer',
    'React Developer',
    'React Native Developer',
    'Node.js Developer',
    'Python Developer',
    'Java Developer',
    'C++ Developer',
    'Software Engineer',
    'Game Developer',
    'AR/VR Developer',
    'Unity Developer',
  ];

  const filteredSkills = skillsOptions.filter((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0)
      return setError('Please select at least one skill.');
    if (selectedSkills.length > 5)
      return setError('You can select up to 5 skills.');

    setIsLoading(true);
    setError(null);
    try {
      console.log('Selected skills:', selectedSkills);
      router.push('/auth/founder-screen');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const sliderData = {
    imageSrc: '/image/ai_splash_screen.png',
    title: 'Showcase Your Skills',
    description:
      'Highlight your expertise to form well-rounded teams and find complementary co-founders.',
  };

  return (
    <SpliteScreen xlScreenSize={true} data={sliderData}>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        What Are Your Top Skills?
      </h2>
      <p className="text-gray-600 mb-4 text-center">
        Select skills that best represent your strengths.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4 text-sm text-center">
          {error}
        </div>
      )}

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search skills..."
        value={searchQuery}
        autoFocus
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 w-full md:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => {
              const selected = selectedSkills.includes(skill);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`flex items-center justify-center text-center px-2 py-2 rounded-full border transition font-medium text-sm whitespace-nowrap
                    ${
                      selected
                        ? 'bg-[#9fcefc] text-black border-[#2983DC] shadow ring-2 ring-[#2983DC]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-[#ffffff] hover:border-[#2983DC]'
                    }
                  `}
                >
                  {skill}
                </button>
              );
            })
          ) : (
            <p className="col-span-full text-sm text-center text-gray-400">
              No skills found.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push('/auth/intrests')}
          disabled={isLoading || selectedSkills.length === 0}
          className="w-full bg-[#2983DC] hover:bg-[#2983DC] text-lg text-white font-semibold py-3 px-6 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:ring-offset-2
              transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </SpliteScreen>
  );
};

export default SkillsetPage;
