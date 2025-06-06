'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen'; // Corrected path

const SkillsetPage = () => {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // A more comprehensive list of skills
  const skillsOptions = [
    { id: 'frontend', label: 'Frontend Development (React, Vue, Angular)' },
    { id: 'backend', label: 'Backend Development (Node.js, Python, Java)' },
    { id: 'fullstack', label: 'Full-stack Development' },
    { id: 'mobile', label: 'Mobile App Development (iOS, Android)' },
    { id: 'devops', label: 'DevOps & Cloud Infrastructure (AWS, Azure, GCP)' },
    { id: 'aiml', label: 'AI & Machine Learning' },
    { id: 'data', label: 'Data Science & Analytics' },
    { id: 'uidesign', label: 'UI/UX Design' },
    { id: 'product', label: 'Product Management' },
    { id: 'project', label: 'Project Management' },
    { id: 'marketing', label: 'Digital Marketing & SEO' },
    { id: 'sales', label: 'Sales & Business Development' },
    { id: 'finance', label: 'Finance & Accounting' },
    { id: 'legal', label: 'Legal & Compliance' },
    { id: 'hr', label: 'Human Resources & Recruitment' },
    { id: 'writing', label: 'Content Creation & Writing' },
    { id: 'strategy', label: 'Business Strategy & Consulting' },
    { id: 'operations', label: 'Operations Management' },
  ];

  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skillId)
        ? prevSkills.filter((id) => id !== skillId)
        : [...prevSkills, skillId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill.');
      return;
    }
    // Allow selection of up to 5 skills
    if (selectedSkills.length > 5) {
      setError('You can select up to 5 skills.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual API call logic
      // await updateUserSkills({ skills: selectedSkills });
      console.log('Selected skills:', selectedSkills);
      router.push('/auth/founder-screen'); // Navigate to the next step
    } catch (err) {
      console.error('Failed to save skills:', err);
      setError(err.message || 'An error occurred while saving your skills.');
    } finally {
      setIsLoading(false);
    }
  };

  const sliderData = {
    imageSrc: '/image/ai_splash_screen.png', // Replace with a relevant image
    title: 'Showcase Your Skills',
    description:
      'Highlight your expertise. This helps in forming well-rounded teams and finding co-founders with complementary skills.',
  };

  return (
    <SpliteScreen data={sliderData}>
      <div className="w-full max-w-xl px-4 py-8"> {/* Increased max-width for more skills */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          What Are Your Top Skills?
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Select up to 5 skills that you excel in or want to contribute.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3"> {/* 3 columns on md+ */}
            {skillsOptions.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleSkillToggle(skill.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-150 ease-in-out text-xs sm:text-sm
                                ${
                                  selectedSkills.includes(skill.id)
                                    ? 'bg-teal-500 border-teal-600 text-white shadow-md ring-2 ring-teal-400 ring-offset-1'
                                    : 'bg-white border-gray-300 hover:border-teal-400 hover:bg-teal-50 text-gray-700'
                                }
                                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`}
              >
                <span className="font-medium">{skill.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">
            You have selected {selectedSkills.length} of 5 skills.
          </p>

          <button
            type="submit"
            disabled={isLoading || selectedSkills.length === 0 || selectedSkills.length > 5}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
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

export default SkillsetPage;
