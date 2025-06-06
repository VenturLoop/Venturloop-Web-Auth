'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpliteScreen from '@/components/SpliteScreen'; // Corrected path
import { updateUserPricingPlan } from '@/utils/AuthApis'; // Assuming this API utility exists

// Helper component for individual pricing plans
const PricingCard = ({ plan, selectedPlan, onSelectPlan }) => {
  const isSelected = plan.id === selectedPlan;
  return (
    <button
      type="button"
      onClick={() => onSelectPlan(plan.id)}
      className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-150 ease-in-out transform hover:scale-105
                  ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-2xl scale-105 ring-4 ring-indigo-400 ring-offset-2'
                      : 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-lg'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75`}
    >
      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      <p className={`text-3xl font-bold mb-1 ${isSelected ? 'text-yellow-300' : 'text-indigo-600'}`}>
        {plan.price}
        <span className={`text-sm font-normal ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>{plan.billingCycle}</span>
      </p>
      <p className={`text-sm mb-4 ${isSelected ? 'text-indigo-100' : 'text-gray-600'}`}>{plan.description}</p>
      <ul className="space-y-2 text-sm">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className={`w-4 h-4 mr-2 ${isSelected ? 'text-yellow-300' : 'text-indigo-500'}`}
              fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      {plan.badge && (
        <div className="mt-4">
          <span className="bg-yellow-400 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{plan.badge}</span>
        </div>
      )}
    </button>
  );
};


const FounderScreenPage = () => {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState('standard'); // Default selection
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic Connect',
      price: '$0',
      billingCycle: '/month',
      description: 'For individuals getting started and exploring.',
      features: ['Access to community forum', 'Limited profile visibility', 'Basic matchmaking'],
      badge: null,
    },
    {
      id: 'standard',
      name: 'Founder Standard',
      price: '$29',
      billingCycle: '/month',
      description: 'For active founders seeking co-founders and resources.',
      features: [
        'Full profile visibility',
        'Advanced matchmaking',
        'Access to exclusive events',
        'Priority support',
      ],
      badge: 'Most Popular',
    },
    {
      id: 'premium',
      name: 'Founder Pro',
      price: '$79',
      billingCycle: '/month',
      description: 'For serious founders needing premium tools and support.',
      features: [
        'All Standard features',
        'Dedicated account manager',
        'Access to investor network',
        'Premium analytics',
        'Early access to new features',
      ],
      badge: null,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) {
      setError('Please select a pricing plan.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual API call logic
      // await updateUserPricingPlan({ planId: selectedPlanId });
      console.log('Selected plan ID:', selectedPlanId);
      router.push('/auth/post-onboarding'); // Navigate to the next step
    } catch (err) {
      console.error('Failed to save pricing plan:', err);
      setError(
        err.message || 'An error occurred while saving your plan choice.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sliderData = {
    imageSrc: '/image/Cofounder_splash_screen.png', // Replace with a relevant image
    title: 'Choose Your Founder Plan',
    description:
      'Select a plan that aligns with your goals and unlocks the full potential of our platform.',
  };

  return (
    <SpliteScreen data={sliderData}>
      <div className="w-full max-w-2xl px-4 py-8"> {/* Increased max-width for pricing cards */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Unlock Your Potential
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Choose the plan that&apos;s right for your journey.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                selectedPlan={selectedPlanId}
                onSelectPlan={setSelectedPlanId}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedPlanId}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                           transition duration-150 ease-in-out shadow-xl hover:shadow-2xl
                           disabled:opacity-60 disabled:cursor-not-allowed text-lg"
          >
            {isLoading ? 'Processing...' : `Continue with ${pricingPlans.find(p => p.id === selectedPlanId)?.name || ''}`}
          </button>
        </form>
        <div className="mt-10 text-center">
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

export default FounderScreenPage;
