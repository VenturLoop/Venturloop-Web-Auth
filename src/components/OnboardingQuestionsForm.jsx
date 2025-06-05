'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const questions = [
  { id: 'q1', text: 'What is your primary goal for using our platform?' },
  { id: 'q2', text: 'How did you hear about us?' },
  { id: 'q3', text: 'What is your current role or occupation?' },
  { id: 'q4', text: 'What are you hoping to achieve in the next 6 months?' },
  { id: 'q5', text: 'Any specific features you are looking for?' },
];

const OnboardingQuestionsForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const initialAnswers = questions.reduce(
    (acc, q) => ({ ...acc, [q.id]: '' }),
    {},
  );
  const [answers, setAnswers] = useState(initialAnswers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
    // Optionally, pre-fill answers if user comes back to this page and has data in session/DB
    // For now, we assume fresh entry or data isn't pre-filled from session for simplicity
  }, [status, router]);

  const handleInputChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/save-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Answers saved successfully!');
        router.push('/post-onboarding'); // Navigate to the next step
      } else {
        setError(data.message || 'Failed to save answers. Please try again.');
        toast.error(
          data.message || 'Failed to save answers. Please try again.',
        );
      }
    } catch (err) {
      console.error('Save onboarding answers error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/post-onboarding');
  };

  if (status === 'loading' || !session) {
    return (
      <div className="flex justify-center items-center p-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        A Few More Questions...
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Help us tailor your experience. These are optional.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <div key={q.id}>
            <label
              htmlFor={q.id}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {q.text}
            </label>
            <textarea
              id={q.id}
              name={q.id}
              rows="3"
              value={answers[q.id]}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your answer..."
              disabled={isLoading}
            />
          </div>
        ))}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-indigo-400"
          >
            {isLoading ? <LoadingSpinner /> : 'Save & Continue'}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-opacity-75 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            Skip for Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingQuestionsForm;
