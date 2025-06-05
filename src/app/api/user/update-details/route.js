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
    return NextResponse.json({ success: false, message: 'Unauthorized: User session not found or user ID missing.' }, { status: 401 });
  }

  try {
    const { location, birthdate, profileImageUrl } = await request.json();

    // Find user by ID from session
    const userIndex = global.userStore.findIndex(user => user.id === session.user.id);

    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: 'User not found in store.' }, { status: 404 });
    }

    // Update user details
    // Only update fields that are provided in the request
    if (location !== undefined) {
        global.userStore[userIndex].location = location;
    }
    if (birthdate !== undefined) {
        // Basic validation for birthdate format if necessary, e.g., YYYY-MM-DD
        // For now, assuming it's a valid date string or null
        global.userStore[userIndex].birthdate = birthdate;
    }
    if (profileImageUrl !== undefined) {
        global.userStore[userIndex].profileImageUrl = profileImageUrl;
    }

    // If this user was marked as a new social user, clear the flag after they submit details
    if (global.userStore[userIndex].isNewSocialUser) {
        global.userStore[userIndex].isNewSocialUser = false;
    }

    // console.log('Updated user details for:', session.user.email, global.userStore[userIndex]); // Debug log removed

    return NextResponse.json({
        success: true,
        message: 'Details updated successfully.',
        updatedUser: { // Optionally return updated fields, useful for client
            location: global.userStore[userIndex].location,
            birthdate: global.userStore[userIndex].birthdate,
            profileImageUrl: global.userStore[userIndex].profileImageUrl,
        }
    });

  } catch (error) {
    console.error('Error in update-details route:', error);
    return NextResponse.json({ success: false, message: 'Internal server error while updating details.' }, { status: 500 });
  }
}
