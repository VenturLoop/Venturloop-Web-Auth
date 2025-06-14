'use client'; // Required if you're using this in Next.js App Router (app/ folder)

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import { getUserByEmail } from '@/utils/AuthApis';
import { useRouter } from 'next/navigation';

export const useAuthRedirect = () => {
  const { setUserData } = useAppContext();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || status !== 'authenticated') return;

    const handleRedirect = async () => {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        const isNewUser = sessionData?.user?.isNewUser;
        const redirectToAddDetails =
          sessionData?.user?.requiresRedirectToAddBasicDetails;

        const token =
          sessionData?.user?.customBackendToken ||
          localStorage.getItem('token');

        if (token) {
          localStorage.setItem('token', token);
        }

        // If Signup page is using this, set default userData
        setUserData((prev) => ({
          ...prev,
          name: session?.user?.name,
          email: session?.user?.email,
          password: 'venturloop@2025',
          profileImageUrl:
            session?.user?.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              session?.user?.name || session?.user?.email || 'User',
            )}&background=random&color=fff&size=96`,
        }));

        if (isNewUser || redirectToAddDetails) {
          return router.push('/auth/add-basic-details');
        }

        const result = await getUserByEmail(session.user.email);
        const userId = result?.data?._id || result?.data?.id;

        if (userId && token) {
          router.push(
            `https://test.venturloop.com/auth/callback?userId=${userId}&token=${token}`,
          );
        } else {
          console.warn('Missing userId or token for redirection');
        }
      } catch (error) {
        console.error('Error during auth redirect:', error);
      }
    };

    handleRedirect();
  }, [session, status]);
};
