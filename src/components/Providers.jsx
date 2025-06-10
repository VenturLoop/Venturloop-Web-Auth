'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import PropTypes from 'prop-types';
import { AppProvider } from '@/context/AppContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Providers = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="892055512866-vjk3oq36ko3pms4q4m74mca07caa3bnb.apps.googleusercontent.com">
      <SessionProvider>
        <AppProvider>{children}</AppProvider>
      </SessionProvider>
    </GoogleOAuthProvider>
  );
};

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Providers;
