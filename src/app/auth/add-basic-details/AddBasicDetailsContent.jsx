// src/app/auth/add-basic-details/AddBasicDetailsContent.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import BasicDetailsForm from '@/components/BasicDetailsForm';
import { updateUserDetailsAPI } from '@/utils/AuthApis';
// Assuming LoadingSpinner path is correct, adjust if necessary
// import LoadingSpinner from '@/components/LoadingSpinner';

export default function AddBasicDetailsContent() {
  const searchParams = useSearchParams();
  const nameFromParams = searchParams.get('name');
  const emailFromParams = searchParams.get('email');
  const passwordFromParams = searchParams.get('password');

  const { data: session, status } = useSession();
  const [isSocialDataSaved, setIsSocialDataSaved] = useState(false);
  // const [isLoadingApi, setIsLoadingApi] = useState(false); // Optional: for specific loading UI

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.email &&
      session?.user?.isNewUser === true &&
      !isSocialDataSaved
    ) {
      // setIsLoadingApi(true); // Optional
      const userDetails = {
        email: session.user.email,
        name: session.user.name || '',
        profileImageUrl: session.user.image || '',
        isNewSocialUser: false, // Explicitly set this to false as part of this update
      };

      updateUserDetailsAPI(userDetails)
        .then(response => {
          if (response.success) {
            toast.success(response.message ||'User profile from social account saved!');
            setIsSocialDataSaved(true);
            // The backend is expected to update isNewSocialUser to false.
            // Session will pick this up on next refresh or if updateSession() is called.
            // No explicit updateSession() call here to rely on backend and session refresh.
          } else {
            toast.error(response.message || 'Failed to save user profile.');
          }
        })
        .catch(error => {
          console.error('Failed to save user profile:', error);
          toast.error(error.message || 'Error saving user profile.');
        })
        // .finally(() => { // Optional
        //   setIsLoadingApi(false);
        // });
    }
  }, [session, status, isSocialDataSaved]);

  // The BasicDetailsForm will be used for users to fill out further details.
  // For email signups, it uses params. For social, their basic info is auto-saved by useEffect.
  // The form could potentially be pre-filled with session.user.name/email if it's a social user.
  return (
    <BasicDetailsForm
      name={nameFromParams}
      email={emailFromParams}
      password={passwordFromParams}
    />
  );
}
