'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming this component exists
import { toast } from 'react-hot-toast'; // Added import

const RedirectPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId;

  useEffect(() => {
    if (userId) {
      // The userId from the backend is present in the URL.
      // Token storage and validation would have been handled by NextAuth callbacks.
      // Now, redirect to addBasicDetails.
      // We can pass the userId if needed by the addBasicDetails page,
      // or it can also fetch it from the session.
      router.replace(`/auth/add-basic-details?userId=${userId}`);
    } else {
      // Handle missing userId in URL - maybe redirect to login or an error page
      console.error('RedirectPage: userId is missing from URL parameters.');
      toast.error('Invalid redirect: User identifier not found. Please try logging in again.'); // Added toast
      router.replace('/login'); // Or some error page
    }
  }, [userId, router]);

  // Display a loading spinner while the redirect is processed
  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
      <p className="ml-2">Loading, please wait...</p>
    </div>
  );
};

export default RedirectPage;
