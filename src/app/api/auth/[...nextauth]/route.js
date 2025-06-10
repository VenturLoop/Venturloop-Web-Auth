import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';
import { handleGoogleSignIn, handleLinkedInSignIn } from '@/utils/AuthApis';

// Initialize in-memory stores if they don't exist
if (!global.otpStore) {
  // Though primarily used in other routes, good to have consistency
  global.otpStore = {};
}
if (!global.userStore) {
  global.userStore = []; // Store users in an array
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // req is unused
        // userStore is guaranteed to be initialized by the top-level check
        if (!credentials || !credentials.email || !credentials.password) {
          return null; // Or throw an error
        }

        const user = global.userStore.find(
          (u) => u.email === credentials.email,
        );

        if (user) {
          // "Compare" the provided password with the stored "hashed" password
          // This is a mock comparison. In a real app, use bcrypt.compareSync()
          const isPasswordValid =
            user.hashedPassword === 'hashed_' + credentials.password;

          if (isPasswordValid) {
            // Return user object that NextAuth expects
            return { id: user.id, name: user.name, email: user.email };
          } else {
            // console.log('Password mismatch for user:', credentials.email); // Debug log removed
            return null; // Password did not match
          }
        } else {
          // console.log('User not found:', credentials.email); // Debug log removed
          return null; // User not found
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: {
        params: { scope: 'openid profile email' },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // console.log('[NextAuth JWT Callback] Invoked.'); // Basic invocation log can be kept if desired
      // Initial sign-in
      if (account && user) {
        // console.log('[NextAuth JWT Callback] Initial sign-in context.');
        // console.log('[NextAuth JWT Callback] Account:', JSON.stringify(account, null, 2)); // Removed
        // console.log('[NextAuth JWT Callback] User:', JSON.stringify(user, null, 2)); // Removed
        // if (profile) {
        //   console.log('[NextAuth JWT Callback] Profile:', JSON.stringify(profile, null, 2)); // Removed
        // }

        token.id = user.id; // Default NextAuth user id
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        // Clear any previous custom backend data or errors on new login attempt
        delete token.customBackendToken;
        delete token.customBackendUserId;
        delete token.requiresRedirectToAddBasicDetails;
        delete token.error;

        try {
          if (account.provider === 'google') {
            // console.log('[NextAuth JWT Callback] Processing Google sign-in.'); // Optional: keep for provider switch visibility
            if (account.id_token) {
              // console.log('[NextAuth JWT Callback] Google idToken:', account.id_token); // Removed
              const backendResponse = await handleGoogleSignIn(account.id_token);
              // console.log('[NextAuth JWT Callback] Backend Response (Google):', JSON.stringify(backendResponse, null, 2)); // Removed
              if (backendResponse && backendResponse.token && backendResponse.userId) {
                token.customBackendToken = backendResponse.token;
                token.customBackendUserId = backendResponse.userId;
                token.requiresRedirectToAddBasicDetails = backendResponse.isNewUser || true;
                // console.log('[NextAuth JWT Callback] Google sign-in successful, backend token stored in JWT.'); // Status log, can be kept or removed
              } else {
                console.error('[NextAuth JWT Callback] Google sign-in: Backend response missing token or userId.', backendResponse); // Kept error
                token.error = "GoogleBackendError";
              }
            } else {
              console.error('[NextAuth JWT Callback] Google sign-in: id_token missing from account object.'); // Kept error
              token.error = "GoogleIdTokenMissing";
            }
          } else if (account.provider === 'linkedin') {
            // console.log('[NextAuth JWT Callback] Processing LinkedIn sign-in.'); // Optional
            const linkedInRedirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`;
            // console.log('[NextAuth JWT Callback] LinkedIn redirect URI:', linkedInRedirectUri); // Removed
            if (account.code) {
              // console.log('[NextAuth JWT Callback] LinkedIn authCode:', account.code); // Removed
              const backendResponse = await handleLinkedInSignIn(account.code, linkedInRedirectUri);
              // console.log('[NextAuth JWT Callback] Backend Response (LinkedIn):', JSON.stringify(backendResponse, null, 2)); // Removed
              if (backendResponse && backendResponse.token && backendResponse.userId) {
                token.customBackendToken = backendResponse.token;
                token.customBackendUserId = backendResponse.userId;
                token.requiresRedirectToAddBasicDetails = backendResponse.isNewUser || true;
                // console.log('[NextAuth JWT Callback] LinkedIn sign-in successful, backend token stored in JWT.'); // Status log
              } else {
                console.error('[NextAuth JWT Callback] LinkedIn sign-in: Backend response missing token or userId.', backendResponse); // Kept error
                token.error = "LinkedInBackendError";
              }
            } else {
               console.error('[NextAuth JWT Callback] LinkedIn sign-in: authorization code (account.code) missing.'); // Kept error
               token.error = "LinkedInAuthCodeMissing";
            }
          }
        } catch (error) {
          console.error(`[NextAuth JWT Callback] Error during ${account.provider} sign-in processing: ${error.message}`, error); // Log message and full error
          if (account.provider === 'google') {
            token.error = "GoogleSignInProcessingError";
          } else if (account.provider === 'linkedin') {
            token.error = "LinkedInSignInProcessingError";
          } else {
            token.error = "OAuthProcessingError"; // Generic for other providers or if provider is unknown
          }

          // Clear custom fields on error
          delete token.customBackendToken;
          delete token.customBackendUserId;
          delete token.requiresRedirectToAddBasicDetails;
        }
      }
      // console.log('[NextAuth JWT Callback] Returning token:', JSON.stringify(token, null, 2)); // Removed
      return token;
    },
    async session({ session, token }) {
      // console.log('[NextAuth Session Callback] Invoked.');
      // console.log('[NextAuth Session Callback] Input token:', JSON.stringify(token, null, 2)); // Removed
      // console.log('[NextAuth Session Callback] Input session:', JSON.stringify(session, null, 2)); // Removed
      if (token) {
        session.user.id = token.id || token.sub; // Standard NextAuth user ID
        session.user.customBackendToken = token.customBackendToken;
        session.user.customBackendUserId = token.customBackendUserId;
        session.user.requiresRedirectToAddBasicDetails = token.requiresRedirectToAddBasicDetails;
        session.user.image = token.picture; // Keep original image from provider or update if needed

        if (token.error) {
          session.error = token.error;
        }
      }
      // console.log('[NextAuth Session Callback] Returning session:', JSON.stringify(session, null, 2)); // Removed
      return session;
    },
async redirect({ url, baseUrl, token }) {
  // console.log('[NextAuth Redirect Callback] Input URL:', url, 'BaseURL:', baseUrl); // Optional
  // if(token) {
  //   console.log('[NextAuth Redirect Callback] Input Token:', JSON.stringify(token, null, 2)); // Removed
  // } else {
  //   console.log('[NextAuth Redirect Callback] Input Token: null or undefined'); // Optional
  // }

  // If there was an error during JWT processing (as indicated by token.error),
  // redirect to the login page. The login page should pick up session.error.
  if (token && token.error) {
    // console.log('[NextAuth Redirect Callback] Error in token detected:', token.error, 'Redirecting to login page.'); // Status log
    return `${baseUrl}/login`;
  }

  // If token exists and user needs to be redirected to add basic details
  if (token && token.requiresRedirectToAddBasicDetails && token.customBackendUserId) {
    const redirectPath = `${baseUrl}/auth/redirect/${token.customBackendUserId}`;
    // console.log(`[NextAuth Redirect Callback] Redirecting to add basic details flow: ${redirectPath}`); // Status log
    return redirectPath;
  }

  // If the user is already on a page that is part of the auth flow post-login,
  // or the intended URL is the addBasicDetails page, let them stay.
  // This helps prevent redirect loops if the user manually navigates or refreshes.
  if (url.startsWith(`${baseUrl}/auth/add-basic-details`) || url.startsWith(`${baseUrl}/auth/redirect`)) {
    // console.log('[NextAuth Redirect Callback] Already on an auth flow page or final details page. Returning URL:', url); // Status log
    return url;
  }

  // Default redirect for authenticated users not needing onboarding or without errors.
  // If the 'url' is the NextAuth callback URL itself (e.g., /api/auth/callback/google),
  // then redirect to the baseUrl (e.g., dashboard/home).
  if (url.startsWith(`${baseUrl}/api/auth/callback`)) {
    // console.log('[NextAuth Redirect Callback] URL is an API callback. Redirecting to baseUrl:', baseUrl); // Status log
    return baseUrl;
  }

  // If the 'url' is a valid URL within the application (starts with baseUrl),
  // allow redirection to that URL. This handles cases where a user was trying to access a protected page.
  if (url.startsWith(baseUrl)) {
    // console.log('[NextAuth Redirect Callback] URL is within application. Redirecting to URL:', url); // Status log
    return url;
  }

  // Fallback: if the 'url' is external or not what's expected (e.g. '/'), redirect to baseUrl.
  // This is a safe default for authenticated users.
  // console.log('[NextAuth Redirect Callback] Default fallback. Redirecting to baseUrl:', baseUrl); // Status log
  return baseUrl;
}
    // We could use the signIn callback for redirection for new social users,
    // but client-side check of session.user.isNewUser is often simpler to manage.
    // async signIn({ user, account, profile, email, credentials }) {
    //   if (account && (account.provider === 'google' || account.provider === 'linkedin')) {
    //     const existingUser = global.userStore.find(u => u.email === user.email);
    //     if (!existingUser) {
    //       // This is a new social user.
    //       // We could add a temporary flag to 'user' object or rely on JWT to set isNewUser
    //       // and then redirect client-side.
    //       // For server-side redirect: return '/add-basic-details';
    //     }
    //   }
    //   return true; // Continue sign in
    // }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
