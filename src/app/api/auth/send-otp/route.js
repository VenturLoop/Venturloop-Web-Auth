import { NextResponse } from 'next/server';

// In-memory store for OTPs. In a real app, use a database.
if (!global.otpStore) {
  global.otpStore = {};
}

const OTP_EXPIRY_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ message: 'Email and name are required' }, { status: 400 });
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + OTP_EXPIRY_DURATION;

    // Store OTP (simulating sending it via email)
    global.otpStore[email] = { otp, expiry, name };

    // Log OTP to console for testing (simulates email sending)
    console.log(`OTP for ${email} (User: ${name}): ${otp}`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully. Please check your console (simulated email).' });

  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
