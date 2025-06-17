'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

// Basic metadata for the root page
export const metadata = {
  title: 'Venturloop Authentication',
  description: 'Authentication portal for Venturloop applications.',
  robots: 'noindex, nofollow', // Discourage indexing for this specific redirecting page
};

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (
    status === 'loading' ||
    (status === 'unauthenticated' && typeof window !== 'undefined')
  ) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Fallback or authenticated content (most of it is commented out in original)
  // If authenticated, user sees their content, if not, they are redirected.
  // If status is 'authenticated' and content were present, this page would be shown.
  // For now, it just shows a "Preparing" message if not loading and not redirecting yet.
  // The commented out section showed a welcome message.

  // If session is authenticated and there was content here, this would be the "dashboard"
  // For now, if not loading and not unauthenticated (i.e. authenticated)
  // it will show the "Preparing your page..." message.
  // This part is reached if status === 'authenticated'
  if (status === 'authenticated') {
    // This is where the commented-out authenticated user dashboard was.
    // For now, we can keep the simple fallback or restore the dashboard if intended.
    // Given the primary function is auth, and then redirect to a main app,
    // a complex page here might be unnecessary.
    // router.replace('https://app.venturloop.com/dashboard'); // Example redirect after login
    return (
       <div className="flex items-center justify-center h-screen bg-gray-50">
        {/* This is where the authenticated user content would go. */}
        {/* Or a redirect to the main application dashboard. */}
        <p className="text-gray-500 text-sm">Loading user dashboard...</p>
        {/* Example: router.replace('https://test.venturloop.com/dashboard'); */}
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-500 text-sm">Preparing your page...</p>
    </div>
  );
}
