'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import PropTypes from 'prop-types'; // Added for prop validation
import { AuthProvider } from '@/context/AuthContext';

const Providers = ({ children }) => {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
};

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Providers;
