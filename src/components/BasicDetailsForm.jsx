'use client';

import React, { useState, useEffect } from 'react';
import { useSession, update } from 'next-auth/react'; // update is not directly used here but good to know it exists
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const BasicDetailsForm = () => {
  const { data: session, status, update: updateSession } = useSession(); // get update function
  const router = useRouter();

  const [location, setLocation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
        // Pre-fill form if data already exists (e.g. from social or previous submission)
        setLocation(session.user.location || '');
        setBirthdate(session.user.birthdate || ''); // Assuming birthdate is directly on user, might need parsing if stored differently
        setProfileImageUrl(session.user.image || ''); // session.user.image should be up-to-date
    } else if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!location && !birthdate && !profileImageUrl) {
        toast.success("Skipping basic details for now.");
        router.push('/onboarding-questions');
        setIsLoading(false);
        return;
    }

    // Basic validation (optional, can be more complex)
    if (birthdate && new Date(birthdate) > new Date()) {
        setError('Birthdate cannot be in the future.');
        toast.error('Birthdate cannot be in the future.');
        setIsLoading(false);
        return;
    }
    if (profileImageUrl && !profileImageUrl.startsWith('http')) {
        // Very basic URL validation
        // setError('Please enter a valid Profile Image URL.');
        // toast.error('Please enter a valid Profile Image URL.');
        // setIsLoading(false);
        // return;
        // Allowing relative paths for now, or could be more robust
    }


    try {
      const response = await fetch('/api/user/update-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, birthdate, profileImageUrl }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Details updated successfully!');

        // Manually trigger a session update if profileImageUrl changed
        // This helps reflect the new image in the UI immediately if it's part of the session
        await updateSession({ profileImageUrl }); // Send only the changed part or refetch all

        router.push('/onboarding-questions');
      } else {
        setError(data.message || 'Failed to update details. Please try again.');
        toast.error(data.message || 'Failed to update details. Please try again.');
      }
    } catch (err) {
      console.error('Update details error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || !session) {
    return <div className="flex justify-center items-center p-10"><LoadingSpinner /></div>;
  }

  return (
    <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Tell Us More About Yourself</h2>
      <p className="text-center text-gray-600 mb-6">
        Logged in as <span className="font-medium">{session.user.email}</span>.
        These details are optional.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location (e.g., City, Country)
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="San Francisco, USA"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
            Birthdate
          </label>
          <input
            id="birthdate"
            name="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700">
            Profile Image URL
          </label>
          <input
            id="profileImageUrl"
            name="profileImageUrl"
            type="url"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://example.com/image.png"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-blue-400"
        >
          {isLoading ? <LoadingSpinner /> : 'Save & Continue'}
        </button>
         <button
            type="button"
            onClick={() => router.push('/onboarding-questions')}
            disabled={isLoading}
            className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-150 flex items-center justify-center shadow-sm hover:shadow-md"
        >
            Skip for Now
        </button>
      </form>
    </div>
  );
};

export default BasicDetailsForm;
