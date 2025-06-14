'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import SpliteScreen from './SpliteScreen';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { createAccount } from '@/utils/AuthApis';
import { useAppContext } from '@/context/AppContext';
import { useSession } from 'next-auth/react';

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
  } catch ({ message }) {
    console.error('Upload error:', message);
    return { success: false, error: message };
  }
};

const BasicDetailsForm = ({ name, email, password }) => {
  const { userData, setUserData } = useAppContext();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [location, setLocation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false); // This is for overall form submission
  const [formError, setFormError] = useState(''); // Renamed from error to avoid confusion
  const [uploadError, setUploadError] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false); // Specific for location fetching
  const [geoError, setGeoError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true); // Can use general isLoading or a specific one for image upload
    setUploadError('');

    const result = await uploadProfileImage(file);

    if (result.success) {
      setProfileImageUrl(result.url);
      toast.success('Profile image uploaded successfully!');
    } else {
      setUploadError(result.error || 'Image upload failed.');
      toast.error(result.error || 'Image upload failed.');
    }

    setIsLoading(false);
  };

  const handleUseCurrentLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      toast.warn('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocationLoading(true);
    setLocation(''); // Clear previous location

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Using a more privacy-friendly and robust geocoding API if possible,
          // but Nominatim is fine for this context.
          // Ensure proper error handling for the fetch call itself.
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
          );

          if (!response.ok) {
            // Handle cases where Nominatim API returns an error (e.g. rate limiting, server error)
            const errorData = await response.json();
            throw new Error(
              errorData.error ||
                `Nominatim API request failed with status ${response.status}`,
            );
          }

          const data = await response.json();

          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            '';
          const country = data?.address?.country || '';

          let fetchedLocation = '';
          if (city && country) {
            fetchedLocation = `${city}, ${country}`;
          } else if (city) {
            fetchedLocation = city;
          } else if (country) {
            fetchedLocation = country;
          } else {
            // Fallback if no useful info is retrieved, though Nominatim usually provides something.
            fetchedLocation = data.display_name || 'Location details not found';
          }

          setLocation(fetchedLocation); // Correctly update the location state
          toast.success('Location fetched!');
        } catch (apiError) {
          // Catch errors from fetch or data processing
          console.error('Error fetching location details:', apiError);
          setGeoError(
            'Failed to retrieve location details. Please try again or enter manually.',
          );
          toast.error('Failed to retrieve location details.');
        } finally {
          setIsLocationLoading(false); // Ensure loading state is turned off
        }
      },
      (permissionError) => {
        // Error callback for getCurrentPosition
        // More specific error messages based on permissionError.code
        if (permissionError.code === permissionError.PERMISSION_DENIED) {
          setGeoError(
            'Geolocation permission denied. Please enable location services in your browser settings.',
          );
          toast.error('Geolocation permission denied.');
        } else if (
          permissionError.code === permissionError.POSITION_UNAVAILABLE
        ) {
          setGeoError('Location information is unavailable.');
          toast.error('Location information is unavailable.');
        } else if (permissionError.code === permissionError.TIMEOUT) {
          setGeoError('Geolocation request timed out.');
          toast.error('Geolocation request timed out.');
        } else {
          setGeoError(
            'Unable to retrieve your location. An unknown error occurred.',
          );
          toast.error('Unable to retrieve your location.');
        }
        setIsLocationLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }, // Added options for geolocation
    );
  };

  useEffect(() => {
    if (status === 'loading') return; // Don't do anything while loading

    if (status === 'authenticated' && session?.user) {
      const { location = '', birthdate = '', image } = session.user;

      setProfileImageUrl(image || '/default-avatar.png');
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    const finalName = name || userData?.name;
    const finalEmail = email || userData?.email;
    const finalPassword = password || userData?.password;

    if (!finalName || !finalEmail || !finalPassword) {
      toast.error(
        'Name, email, and password are required from previous steps.',
      );
      setFormError('Name, email, and password are required.');
      setIsLoading(false);
      return;
    }

    // Optional fields check - if all are empty, allow skip.
    // If some are filled, proceed with validation for those filled (e.g. birthdate format).
    if (!location && !birthdate && !profileImageUrl) {
      toast.info('Skipping basic details. You can update them later.');
      // Navigate to the next step, assuming user data from context/props is sufficient
      // This part of logic depends on how user data is passed to next step
      setUserData((prev) => ({
        ...prev,
        // ensure essential identifiers like email, name are carried over
        name: finalName,
        email: finalEmail,
        // password should not be stored in context this way, it's passed for account creation API call
      }));
      router.push('/auth/skillset');
      setIsLoading(false); // Ensure loading is stopped
      return;
    }

    if (birthdate) {
      const birthDateObj = new Date(birthdate);
      const today = new Date();
      // Set hours to 0 to compare dates only
      birthDateObj.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (birthDateObj > today) {
        setFormError('Birthdate cannot be in the future.');
        toast.error('Birthdate cannot be in the future.');
        setIsLoading(false);
        return;
      }
    }
    
    try {
      const accountDetails = {
        name: finalName,
        email: finalEmail,
        password: finalPassword, // Password should be handled securely and ideally not passed around like this
        ...(birthdate && { birthdate }), // Only include if not empty
        ...(location && { location }), // Only include if not empty
        ...(profileImageUrl && { profileImageUrl }), // Only include if not empty
      };
      
      console.log("accountDetails", accountDetails)
      const response = await createAccount(accountDetails);

      if (response?.success) {
        setUserData((prev) => ({
          ...prev,
          _id: response?.user?.id,
          ...accountDetails,
          profileImageUrl: profileImageUrl || prev.profileImageUrl,
        }));
        toast.success('Account details saved successfully!');
        router.push('/auth/skillset');
      } else {
        setFormError(
          response?.message || 'Signup failed. Please check your details.',
        );
        toast.error(response?.message || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setFormError('An unexpected error occurred during signup.');
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const data = {
    imageSrc: '/image/Cofounder_splash_screen.png',
    title: 'Complete Your Profile',
    description:
      'Provide these details to enhance your profile. You can skip and add them later.',
  };

  return (
    <SpliteScreen data={data}>
      <div className="w-full gap-5 max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Tell Us More About Yourself
        </h2>

        <p className="text-center text-base text-gray-600 mb-8">
          Logged in as{' '}
          <span className="font-semibold">{email || userData?.email}</span>.
          These details are optional.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full max-w-md mx-auto space-y-5 bg-white px-6 mb-2">
            {profileImageUrl ? (
              <div className="flex justify-center">
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="rounded-full object-cover border border-gray-500 shadow-md"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-base">
                  Add Image
                </div>
              </div>
            )}

            {uploadError && (
              <div className="text-center">
                <p className="text-red-600 text-base font-medium">
                  {uploadError}
                </p>
              </div>
            )}

            <div className="text-center mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading} // General loading state for form
                className="hidden"
                id="profileImageInput"
              />
              <label
                htmlFor="profileImageInput"
                className={`inline-block bg-white hover:bg-blue-50 text-black border border-gray-500 font-semibold text-base px-6 py-2 rounded-full shadow-md transition cursor-pointer ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isLoading && !isLocationLoading
                  ? 'Saving...'
                  : 'Upload Profile Image'}
              </label>
            </div>
            <input
              type="hidden"
              name="profileImageUrl"
              value={profileImageUrl}
            />
          </div>

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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2983DC]">
                <FaMapMarkerAlt />
              </span>
              <input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location or detect"
                disabled={isLocationLoading || isLoading} // Disable if location is loading or form is submitting
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:border-[#2983DC] sm:text-base"
              />
            </div>

            {geoError && (
              <p className="text-sm text-red-600 mt-1">{geoError}</p>
            )}

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocationLoading || isLoading} // Disable if location is loading or form is submitting
              className="text-sm text-[#2983DC] hover:text-indigo-800 font-medium transition disabled:opacity-50 flex items-center"
            >
              <FaMapMarkerAlt className="mr-2" /> {/* Icon for the button */}
              {isLocationLoading ? 'Detecting...' : 'Use My Current Location'}
            </button>
          </div>

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
              onChange={(e) => {
                setBirthdate(e.target.value);
                console.log('e.target.value', e.target.value);
              }}
              disabled={isLoading} // General loading state for form
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:border-[#2983DC] sm:text-base"
            />
          </div>

          {formError && (
            <p className="text-center text-base text-red-600">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || isLocationLoading} // Disable if any loading is active
            className="w-full bg-[#2983DC] mt-4 hover:bg-[#2472c1] text-white font-semibold py-3 text-lg px-4 rounded-md shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2983DC] focus:ring-offset-2 disabled:bg-[#98c3e7] flex items-center justify-center"
          >
            {isLoading && !isLocationLoading ? (
              <LoadingSpinner size="small" />
            ) : isLocationLoading ? (
              'Detecting Location...'
            ) : (
              'Save & Continue'
            )}
          </button>
        </form>
      </div>
    </SpliteScreen>
  );
};

BasicDetailsForm.propTypes = {
  name: PropTypes.string, // Allow to be optional if fetched from context/session
  email: PropTypes.string, // Allow to be optional
  password: PropTypes.string, // Allow to be optional
};

// Set default props for name, email, password if they can truly be optional
// or ensure they are always passed, e.g. from a previous step or session.
// For now, assuming they might not be passed directly if user navigates here
// and data is expected from context.
BasicDetailsForm.defaultProps = {
  name: '',
  email: '',
  password: '',
};

export default BasicDetailsForm;
