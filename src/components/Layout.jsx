import React from 'react';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

const Layout = ({ children, leftContent }) => {
  return (
    <>
      {/* Toaster for notifications, sits above other content */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
        {/* Left Side: Visible on medium screens and up */}
        <div className="hidden md:block md:w-1/2 lg:w-3/5 xl:w-1/2 h-full overflow-y-auto bg-gray-100 shadow-lg">
          {/*
            Ensure leftContent (Slider) is designed to fill this container.
            The Slider component itself should handle its internal styling (e.g., full height).
          */}
          {leftContent ? (
            leftContent
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-2xl text-gray-500">Promotional Content Area</p>
            </div>
          )}
        </div>

        {/* Right Side: Takes full width on small screens, remaining width on medium+ */}
        <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/2 h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto bg-white">
          {/*
            The children (AuthForm) will be centered here.
            AuthForm should have its own max-width for better readability on large screens.
          */}
          {children}
        </div>
      </div>
    </>
  );
};


Layout.defaultProps = {
  leftContent: null, // Or a default component/element if you prefer
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  leftContent: PropTypes.node.isRequired,
};

export default Layout;
