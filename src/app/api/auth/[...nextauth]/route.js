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
      // Initial sign-in
      if (account && user) {
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
            if (account.id_token) {
              const backendResponse = await handleGoogleSignIn(account.id_token);
              if (backendResponse && backendResponse.token && backendResponse.userId) {
                token.customBackendToken = backendResponse.token;
                token.customBackendUserId = backendResponse.userId;
                token.requiresRedirectToAddBasicDetails = backendResponse.isNewUser || true;
                console.log('Google sign-in successful, backend token stored in JWT.');
              } else {
                console.error('Google sign-in: Backend response missing token or userId', backendResponse);
                token.error = "GoogleBackendError"; // Specific error
              }
            } else {
              console.error('Google sign-in: id_token missing from account object');
              token.error = "GoogleIdTokenMissing";
            }
          } else if (account.provider === 'linkedin') {
            const linkedInRedirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`;
            if (account.code) {
              const backendResponse = await handleLinkedInSignIn(account.code, linkedInRedirectUri);
              if (backendResponse && backendResponse.token && backendResponse.userId) {
                token.customBackendToken = backendResponse.token;
                token.customBackendUserId = backendResponse.userId;
                token.requiresRedirectToAddBasicDetails = backendResponse.isNewUser || true;
                console.log('LinkedIn sign-in successful, backend token stored in JWT.');
              } else {
                console.error('LinkedIn sign-in: Backend response missing token or userId', backendResponse);
                token.error = "LinkedInBackendError"; // Specific error
              }
            } else {
               console.error('LinkedIn sign-in: authorization code (account.code) missing.');
               token.error = "LinkedInAuthCodeMissing";
            }
          }
        } catch (error) {
          console.error(`Error during ${account.provider} sign-in processing:`, error);
          token.error = "OAuthProcessingError"; // General error for caught exceptions
          // Ensure custom fields are cleared if an exception occurred mid-process
          delete token.customBackendToken;
          delete token.customBackendUserId;
          delete token.requiresRedirectToAddBasicDetails;
        }
      }
      return token;
    },
    async session({ session, token }) {
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
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      // url is the intended redirect URL (e.g., to original page user was trying to access)
      // baseUrl is the base URL of the site

      // If token is not available (e.g. on initial load before session is established for this callback context),
      // or customBackendUserId is missing, or no specific redirect is required,
      // allow default behavior or redirect to baseUrl.
      if (!token || !token.customBackendUserId) {
        // If signing out, url might be baseUrl/login or similar.
        // If url is already pointing to a valid page after an action (like signout), let it proceed.
        // If it's an initial login and token isn't fully processed yet for redirect logic, might default to baseUrl.
        return url.startsWith(baseUrl) ? url : baseUrl;
      }

      if (token.requiresRedirectToAddBasicDetails && token.customBackendUserId) {
        const redirectPath = `/auth/redirect/${token.customBackendUserId}`;
        console.log(`Redirecting to: ${baseUrl}${redirectPath}`);
        return `${baseUrl}${redirectPath}`;
      }

      // If already on the addBasicDetails page or the redirect page, don't loop.
      if (url.includes('/auth/add-basic-details') || url.includes('/auth/redirect/')) {
        return url;
      }

      // Default redirect for logged-in users not needing onboarding
      // This could be a dashboard or the originally requested URL if appropriate
      // For now, let's default to baseUrl if no other conditions met.
      // If 'url' is a relative path from a protected page, it might be the one to go to.
      // If 'url' is the baseUrl itself (e.g. after login button on homepage), then baseUrl is fine.
      return url.startsWith(baseUrl) ? url : baseUrl;
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
