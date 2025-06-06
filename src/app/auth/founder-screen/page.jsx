'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    billingCycle: '',
    description: 'Try it risk-free, no commitment.',
    features: [
      'Feature label goes here',
      'Feature label goes here',
      'Feature label goes here',
      'Feature label goes here',
    ],
    highlight: false,
  },
  {
    id: 'founder',
    name: "Founder's Pass",
    price: '$49',
    billingCycle: '/lifetime',
    description: 'Lifetime access to premium features.',
    features: [
      'Feature label goes here',
      'Feature label goes here',
      'Feature label goes here',
      'Feature label goes here',
    ],
    highlight: true,
  },
];

const FounderScreenPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('founder');
  const [billingCycle, setBillingCycle] = useState('yearly'); // Default selected tab
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      setError('Please select a plan to continue.');
      return;
    }
    setIsLoading(true);
    try {
      console.log('Selected Plan:', selectedPlan);
      router.push('/auth/post-onboarding');
    } catch (err) {
      console.error('Error saving plan:', err);
      setError('An error occurred while processing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d7e4ff] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Transparent Pricing</h2>
        <p className="text-gray-600 text-sm">Pricing built for people just like you.</p>
        <div className="inline-flex mt-4 rounded-full bg-gray-200 p-1">
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              billingCycle === 'yearly' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
            }`}
          >
            Yearly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              billingCycle === 'monthly' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 shadow-sm ${
              plan.highlight
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xl scale-[1.02]'
                : 'bg-white border-gray-200 hover:shadow-lg'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-4 right-4">
                <span className="text-xs bg-white text-indigo-600 font-semibold px-3 py-1 rounded-full shadow-sm">
                  Recommended
                </span>
              </div>
            )}

            <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-800'}`}>
              {plan.name}
            </h3>
            <p className={`text-4xl font-extrabold mb-1 ${plan.highlight ? 'text-yellow-300' : 'text-indigo-600'}`}>
              {plan.price}
              <span className={`text-sm font-medium ml-1 ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                {plan.billingCycle}
              </span>
            </p>
            <p className={`text-sm mb-4 ${plan.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>
              {plan.description}
            </p>
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className={`w-4 h-4 mr-2 ${
                      plan.highlight ? 'text-yellow-300' : 'text-indigo-500'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* 🖼️ Add Illustration Image Here */}
            {plan.highlight && (
              <div className="mt-6 flex justify-end">
                {/* Replace with actual image */}
                {/* <img src="/path-to-your-illustration.jpg" alt="Illustration" className="w-24 h-auto" /> */}
                {/* Example: */}
                {/* <img src="/image/founder_character.png" alt="Founder's Illustration" className="w-28 h-auto" /> */}
                {/* OR use uploaded image: */}
                {/* <img src="/uploads/3fede415-edba-4f29-9008-7d06d8a07722.jpg" alt="Illustration" className="w-28 h-auto" /> */}
              </div>
            )}
          </div>
        ))}

        <div className="md:col-span-2 mt-6">
          {error && (
            <div className="text-center text-red-600 text-sm mb-4">{error}</div>
          )}
          <button
            type="button"
             onClick={() => {
            router.push(`/auth/post-onboarding`);
          }}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : `Continue with ${plans.find((p) => p.id === selectedPlan)?.name}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FounderScreenPage;
