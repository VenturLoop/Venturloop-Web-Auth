import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path as necessary

// Ensure userStore is initialized
if (!global.userStore) {
  global.userStore = [];
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized: User session not found or user ID missing.',
      },
      { status: 401 },
    );
  }

  try {
    const answers = await request.json();

    // Basic validation for answers (e.g., check if it's an object)
    if (typeof answers !== 'object' || answers === null) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid answers format. Expected an object.',
        },
        { status: 400 },
      );
    }

    // You could add more specific validation for each answer if needed (e.g., q1, q2 exist)

    const userIndex = global.userStore.findIndex(
      (user) => user.id === session.user.id,
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found in store.' },
        { status: 404 },
      );
    }

    // Update user's record with onboarding answers
    global.userStore[userIndex].onboardingAnswers = answers;
    // Mark that onboarding questions have been completed if needed for future logic
    global.userStore[userIndex].onboardingCompleted = true;

    // console.log('Saved onboarding answers for:', session.user.email, global.userStore[userIndex].onboardingAnswers); // Debug log removed

    return NextResponse.json({
      success: true,
      message: 'Onboarding answers saved successfully.',
    });
  } catch (error) {
    console.error('Error in save-onboarding route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while saving answers.',
      },
      { status: 500 },
    );
  }
}
