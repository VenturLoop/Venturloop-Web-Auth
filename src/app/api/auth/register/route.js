import { NextResponse } from 'next/server';

// Initialize in-memory stores if they don't exist
if (!global.otpStore) {
  global.otpStore = {};
}
if (!global.userStore) {
  global.userStore = []; // Store users in an array
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }

    // Password complexity (example: min 8 characters)
    if (password.length < 8) {
        return NextResponse.json({ success: false, message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Verify OTP status
    const otpData = global.otpStore[email];
    if (!otpData || !otpData.verified) {
      return NextResponse.json({ success: false, message: 'Email not verified or OTP expired. Please complete OTP verification first.' }, { status: 400 });
    }

    // Check if user already exists
    if (global.userStore.find(user => user.email === email)) {
      // Clear OTP store for this email as registration is attempted again for an existing user.
      // Depending on desired UX, you might allow password reset or just inform user.
      delete global.otpStore[email];
      return NextResponse.json({ success: false, message: 'User already exists with this email.' }, { status: 409 }); // 409 Conflict
    }

    // Retrieve name from OTP store
    const name = otpData.name || 'User'; // Fallback name if not set during OTP

    // Mock Password Hashing (replace with bcrypt in a real app)
    const hashedPassword = 'hashed_' + password;

    // Store user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      email,
      name,
      hashedPassword,
      createdAt: new Date().toISOString(),
      profileImageUrl: null, // Initialize basic details fields
      location: null,
      birthdate: null,
      isNewSocialUser: false, // Credentials users are not "new social users"
      onboardingAnswers: null, // Initialize onboarding fields
      onboardingCompleted: false,
    };
    global.userStore.push(newUser);

    // console.log('Current userStore:', global.userStore); // Debug log removed

    // Clear OTP from store after successful registration
    delete global.otpStore[email];

    return NextResponse.json({ success: true, message: 'Registration successful. You can now sign in.' });

  } catch (error) {
    console.error('Error in register route:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
