'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const {  status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Show loading while session is being determined
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

  // Fallback for SSR when session is not available
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-500 text-sm">Preparing your page...</p>
    </div>
  );
}
