'use client';

import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ✅ All states used in APIs
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    birthday: '',
    location: '',
    profilePhoto: '', // used as profileImageUrl
    skillSet: [],
    industries: [],
    priorStartupExperience: '',
    commitmentLevel: '',
    equityExpectation: '',
    status: '', // optional, default is ''
  });

  const [authToken, setAuthToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        authToken,
        setAuthToken,
        profileData,
        setProfileData,
        isLoggedIn,
        setIsLoggedIn,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAppContext = () => useContext(AppContext);
