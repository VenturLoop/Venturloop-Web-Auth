import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { authCode, redirectUri } = await request.json();

    if (!authCode || !redirectUri) {
      return NextResponse.json({ message: 'Missing authCode or redirectUri' }, { status: 400 });
    }

    // Step 1: Exchange authorization_code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('LinkedIn Token Exchange Error:', tokenData);
      return NextResponse.json({ message: 'Failed to exchange LinkedIn auth code for access token', details: tokenData }, { status: tokenResponse.status });
    }

    const accessToken = tokenData.access_token;

    // Step 2: Fetch user's profile from LinkedIn using the access token
    // LinkedIn now uses /v2/userinfo for OpenID Connect, or /v2/me for older profile data + /v2/emailAddress for email
    // Using /v2/userinfo as it's more standard for OIDC scopes like r_liteprofile and r_emailaddress
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      console.error('LinkedIn Profile Fetch Error:', profileData);
      return NextResponse.json({ message: 'Failed to fetch LinkedIn user profile', details: profileData }, { status: profileResponse.status });
    }

    // Expected profileData structure from /v2/userinfo with r_liteprofile and r_emailaddress:
    // {
    //   "sub": "xxxx",
    //   "email_verified": true,
    //   "name": "First Last",
    //   "locale": { "country": "US", "language": "en" },
    //   "given_name": "First",
    //   "family_name": "Last",
    //   "email": "user@example.com",
    //   "picture": "url-to-picture" (optional, may need r_basicprofile for more complete profile)
    // }
    // If picture is not in userinfo, might need separate call or adjust scopes/backend expectation.
    // For now, assume name, email, and picture (if available) are the primary fields.

    const linkedInUserData = {
      id: profileData.sub, // LinkedIn's unique ID for the user
      name: profileData.name,
      email: profileData.email,
      profilePicture: profileData.picture, // This might be 'picture' or 'profile_picture' or require r_basicprofile
    };

    // Step 3: Send LinkedIn user data to your backend API
    // This endpoint /auth/linkedin-signup needs to be created on your main backend service
    const backendApiResponse = await fetch('https://venturloopbackend-v-1-0-9.onrender.com/auth/linkedin-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkedInUserData),
    });

    const backendData = await backendApiResponse.json();

    if (!backendApiResponse.ok) {
      console.error('Your Backend LinkedIn Signup Error:', backendData);
      return NextResponse.json({ message: 'Failed to process LinkedIn user data with backend', details: backendData }, { status: backendApiResponse.status });
    }

    // Return the token and userId from *your* backend
    return NextResponse.json(backendData, { status: 200 });

  } catch (error) {
    console.error('LinkedIn Exchange API Route Error:', error);
    return NextResponse.json({ message: 'Internal server error during LinkedIn OAuth exchange.', error: error.message }, { status: 500 });
  }
}
