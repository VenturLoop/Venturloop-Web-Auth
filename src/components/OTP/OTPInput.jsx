import React, { useRef } from 'react';

const OtpInput = ({ otp, setOtp, isLoading }) => {
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/, '').charAt(0) || '';
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3 mt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={isLoading}
          value={otp[i] || ''}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-8 sm:w-10 md:w-10 h-10 sm:h-12 text-center text-lg border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      ))}
    </div>
  );
};

export default OtpInput;
