// components/layouts/AuthLayout.jsx

import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

export default function SpliteScreen({ data, children }) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row h-screen w-screen bg-white">
        {/* Left Column: Illustration */}
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 xl:w-1/2 bg-white flex-col justify-center items-center p-8 text-center">
          <Image
            src={data.imageSrc.trim()} // Trim any accidental space
            alt="Image"
            width={384}
            height={216}
            className="max-w-sm mx-auto mb-8"
            priority
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {data.title}
          </h1>
          <p className="text-lg text-gray-600">{data.description}</p>
        </div>

        {/* Right Column: Children */}
        <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </>
  );
}

SpliteScreen.propTypes = {
  data: PropTypes.shape({
    imageSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};
