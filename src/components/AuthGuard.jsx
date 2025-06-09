'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner'; // Assuming path is correct

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
// Add other public paths like terms, privacy, etc., if needed.
// Example: '/terms-of-service', '/privacy-policy'

export default function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') {
      // Do nothing while session status is loading, the return below will handle UI
      return;
    }

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (status === 'unauthenticated' && !isPublicPath) {
      router.replace('/login');
    } else if (status === 'authenticated' && (pathname === '/login' || pathname === '/auth/signup')) {
      // Optional: Redirect logged-in users away from login/signup pages
      router.replace('/'); // Or a designated dashboard page
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If authenticated, or if unauthenticated but on a public path, allow access
  if (status === 'authenticated' || (status === 'unauthenticated' && PUBLIC_PATHS.includes(pathname))) {
    return <>{children}</>;
  }

  // If unauthenticated and on a protected path, redirection is in progress.
  // Show a loader to prevent flashing of content before redirect completes.
  // This case is mostly covered by the router.replace in useEffect,
  // but this ensures a loader is shown during the brief period before redirect effect.
  if (status === 'unauthenticated' && !PUBLIC_PATHS.includes(pathname)) {
    return (
        <div className="flex h-screen w-screen justify-center items-center">
          <LoadingSpinner />
        </div>
      );
  }

  // Fallback, though ideally one of the above conditions should always be met.
  return null;
}
