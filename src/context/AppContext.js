'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSession } from 'next-auth/react';

const AppContext = createContext();

const initialUserDataState = {
  name: '',
  email: '',
  // password: '', // Password should not be stored in context
  birthday: '',
  location: '',
  profilePhoto: '', // used as profileImageUrl
  skillSet: [],
  industries: [],
  priorStartupExperience: '',
  commitmentLevel: '',
  equityExpectation: '',
  status: '', // optional, default is ''
};

export const AppProvider = ({ children }) => {
  const { data: session, status: sessionStatus } = useSession();
  const [userData, setUserData] = useState(initialUserDataState);
  const [authToken, setAuthToken] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const isLoggedIn = sessionStatus === 'authenticated';
  const isLoading = sessionStatus === 'loading';

  useEffect(() => {
    if (session?.user) {
      setUserData(prevData => ({
        ...prevData,
        name: session.user.name || '',
        email: session.user.email || '',
        profilePhoto: session.user.image || '', // Sync with session image
        // Optionally sync other fields if they exist directly on session.user
        // id: session.user.id // Example if you add id to session user
      }));
    }
    // Optional: Reset userData if session becomes null (user logs out)
    // else if (!session && sessionStatus !== 'loading') {
    //   setUserData(initialUserDataState);
    // }
  }, [session, sessionStatus]);


  return (
    <AppContext.Provider
      value={{
        session, // Full session object from NextAuth
        status: sessionStatus, // Auth status: 'loading', 'authenticated', 'unauthenticated'
        isLoggedIn, // Derived boolean for convenience
        isLoading,  // Derived boolean for convenience
        userData,
        setUserData,
        authToken,
        setAuthToken,
        profileData,
        setProfileData,
        // setIsLoggedIn, // No longer needed, derived from status
        // setLoading, // No longer needed, derived from status
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
