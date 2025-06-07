'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { AppProvider } from '@/context/AppContext';

const Providers = ({ children }) => {
  return (
    <SessionProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </SessionProvider>
  );
};

export default Providers;
