'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import PropTypes from 'prop-types';
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

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Providers;
