import { NextResponse } from 'next/server';

// Ensure otpStore is initialized (it should be by send-otp, but good for standalone testing)
if (!global.otpStore) {
  global.otpStore = {};
}

const MAX_OTP_ATTEMPTS = 5; // Example: Allow 5 attempts

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }

    // Basic OTP format validation (e.g., 6 digits)
    if (!/^\d{6}$/.test(otp)) {
        return NextResponse.json({ success: false, message: 'Invalid OTP format. Must be 6 digits.' }, { status: 400 });
    }

    const storedOtpData = global.otpStore[email];

    if (!storedOtpData) {
      return NextResponse.json({ success: false, message: 'OTP not found or already used. Please request a new one.' }, { status: 400 });
    }

    // Increment attempt counter or initialize if not present
    storedOtpData.attempts = (storedOtpData.attempts || 0) + 1;

    if (storedOtpData.attempts > MAX_OTP_ATTEMPTS) {
      delete global.otpStore[email]; // Clear OTP after too many attempts
      return NextResponse.json({ success: false, message: 'Too many failed OTP attempts. Please request a new one.' }, { status: 400 });
    }

    if (Date.now() > storedOtpData.expiry) {
      delete global.otpStore[email]; // Clear expired OTP
      return NextResponse.json({ success: false, message: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (storedOtpData.otp === otp) {
      // OTP is correct. For security, clear it after successful verification.
      // Keep user's name and email for potential next step (e.g. create password, link account)
      global.otpStore[email] = {
        verified: true,
        email: email,
        name: storedOtpData.name,
        verifiedAt: Date.now()
      };
      return NextResponse.json({ success: true, message: 'OTP verified successfully.' });
    } else {
      // Update the store with the new attempt count
      global.otpStore[email] = storedOtpData;
      return NextResponse.json({ success: false, message: 'Invalid OTP.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
