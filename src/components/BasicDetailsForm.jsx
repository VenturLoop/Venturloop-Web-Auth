'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // update import removed
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import SpliteScreen from './SpliteScreen';
import { FaMapMarkerAlt } from 'react-icons/fa';


// Your upload function
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/api/upload/profile',
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return {
      success: true,
      url: data.url,
      fileId: data.fileId,
      message: data.message,
    };
  } catch (error) {
    console.error('Upload error:', error.message);
    return { success: false, error: error.message };
  }
};

const BasicDetailsForm = ({ email }) => {
  const { data: session, status, update: updateSession } = useSession(); // get update function
  const router = useRouter();

  const [location, setLocation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setUploadError('');

    const result = await uploadProfileImage(file);

    if (result.success) {
      setProfileImageUrl(result.url);
    } else {
      setUploadError(result.error);
    }

    setIsLoading(false);
  };

  const handleUseCurrentLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            '';
          const country = data?.address?.country || '';

          setIsLocationLoading(`${city}, ${country}`);
        } catch (error) {
          setGeoError('Failed to retrieve location. Try again.');
        } finally {
          setIsLocationLoading(false);
        }
      },
      () => {
        setGeoError('Unable to retrieve your location.');
        setIsLocationLoading(false);
      },
    );
  };
  // useEffect(() => {
  //   if (status === 'authenticated' && session?.user) {
  //     // Pre-fill form if data already exists (e.g. from social or previous submission)
  //     setLocation(session.user.location || '');
  //     setBirthdate(session.user.birthdate || ''); // Assuming birthdate is directly on user, might need parsing if stored differently
  //     setProfileImageUrl(session.user.image || ''); // session.user.image should be up-to-date
  //   } else if (status === 'unauthenticated') {
  //     router.replace('/login');
  //   }
  // }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!location && !birthdate && !profileImageUrl) {
      toast.success('Skipping basic details for now.');
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
    // Commented out profileImageUrl validation has been removed.

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

        router.push('/auth/onboarding-questions');
      } else {
        setError(data.message || 'Failed to update details. Please try again.');
        toast.error(
          data.message || 'Failed to update details. Please try again.',
        );
      }
    } catch (err) {
      console.error('Update details error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // if (status === 'loading' || !session) {
  //   return (
  //     <div className="flex justify-center items-center p-10">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }
  const data = {
    imageSrc: '/image/Cofounder_splash_screen.png', // Customize the image path
    title: 'Complete Your Profile',
    description:
      'Please provide your basic details to complete your account setup.',
  };

  return (
    <SpliteScreen data={data}>
      <div className="w-full gap-5 max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Tell Us More About Yourself
        </h2>

        <p className="text-center text-base text-gray-600 mb-8">
          Logged in as <span className="font-semibold">{email}</span>. These
          details are optional.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full max-w-md mx-auto space-y-5 bg-white px-6 mb-2">
            {/* Profile Image Preview */}
            {profileImageUrl ? (
              <div className="flex justify-center">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border border-gray-500 shadow-md"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-base">
                  Add Image
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="text-center">
                <p className="text-red-600 text-base font-medium">
                  {uploadError}
                </p>
              </div>
            )}

            {/* Upload Area */}
            <div className="text-center mt-4">
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
                id="profileImageInput"
              />
              <label
                htmlFor="profileImageInput"
                className="inline-block bg-white hover:bg-blue-50 text-black border border-gray-500 font-semibold text-base px-6 py-2 rounded-full shadow-md transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Uploading...' : 'Upload Profile Image'}
              </label>
            </div>

            {/* Hidden Field */}
            <input
              type="hidden"
              name="profileImageUrl"
              value={profileImageUrl}
            />
          </div>

          {/* Location */}
          <div className="w-full space-y-2">
            <label
              htmlFor="location"
              className="block text-base font-medium text-gray-800"
            >
              Location{' '}
              <span className="text-xs text-gray-500">
                (e.g., City, Country)
              </span>
            </label>

            <div className="relative">
              <span className="absolute left-3 top-3 text-[#2983DC]">
                <FaMapMarkerAlt />
              </span>
              <input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isLocationLoading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:border-[#2983DC] sm:text-base"
              />
            </div>

            {geoError && <p className="text-base text-red-600">{geoError}</p>}

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocationLoading}
              className="text-base text-[#2983DC] hover:text-indigo-800 font-medium transition disabled:opacity-50"
            >
              📍 {isLocationLoading ? 'Detecting...' : 'Use My Current Location'}
            </button>
          </div>

          {/* Birthdate */}
          <div>
            <label
              htmlFor="birthdate"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Birthday
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:border-[#2983DC] sm:text-base"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-center text-base text-red-600">{error}</p>
          )}

          {/* Submit Button */}
          <button
            // type="submit"
            type="button"
            onClick={() => {
              router.push(`/auth/skillset`);
            }}
            disabled={isLoading}
            className="w-full bg-[#2983DC] mt-4 hover:bg-[#2472c1] text-white font-semibold py-3 text-lg px-4 rounded-md shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:ring-offset-2 disabled:bg-[#98c3e7]"
          >
            {isLoading ? <LoadingSpinner /> : 'Save & Continue'}
          </button>
        </form>
      </div>
    </SpliteScreen>
  );
};

export default BasicDetailsForm;
