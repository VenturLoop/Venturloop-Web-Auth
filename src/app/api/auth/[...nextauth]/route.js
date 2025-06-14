import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { handleGoogleSignIn } from '@/utils/AuthApis';

// Initialize in-memory stores if they don't exist
if (!global.otpStore) {
  // Though primarily used in other routes, good to have consistency
  global.otpStore = {};
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
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
              const backendResponse = await handleGoogleSignIn(
                account.id_token,
              );
              if (
                backendResponse?.success &&
                backendResponse.token &&
                backendResponse.user?._id
              ) {
                token.customBackendToken = backendResponse.token;
                token.customBackendUserId = backendResponse.user._id;
                token.requiresRedirectToAddBasicDetails =
                  backendResponse.isNewUser === true;
                token.isNewUser = backendResponse.isNewUser === true;

                console.log(
                  'Google sign-in successful, backend token stored in JWT.',
                );
              } else {
                console.error(
                  'Google sign-in: Backend response missing token or userId',
                  backendResponse,
                );
                token.error = 'GoogleBackendError'; // Specific error
              }
            } else {
              console.error(
                'Google sign-in: id_token missing from account object',
              );
              token.error = 'GoogleIdTokenMissing';
            }
          }
        } catch (error) {
          console.error(
            `Error during ${account.provider} sign-in processing:`,
            error,
          );
          token.error = 'OAuthProcessingError'; // General error for caught exceptions
          // Ensure custom fields are cleared if an exception occurred mid-process
          delete token.customBackendToken;
          delete token.customBackendUserId;
          delete token.requiresRedirectToAddBasicDetails;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id || token.sub; // Standard NextAuth user ID
        session.user.customBackendToken = token.customBackendToken;
        session.user.customBackendUserId = token.customBackendUserId;
        session.user.requiresRedirectToAddBasicDetails =
          token.requiresRedirectToAddBasicDetails;
        session.user.image = token.picture; // Keep original image from provider or update if needed
        session.user.isNewUser = token.isNewUser;

        if (token.error) {
          session.error = token.error;
        }
      }
      if (user) {
        session.user.id = user.id; // Add user ID to session
      }
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      if (!token || !token.customBackendUserId) {
        return url.startsWith(baseUrl) ? url : baseUrl;
      }
      if (token.isNewUser || token.requiresRedirectToAddBasicDetails) {
        console.log(
          'New user detected. Redirecting to /auth/add-basic-details',
        );
        return `${baseUrl}/auth/add-basic-details`;
      }

      console.log('Redirecting existing user to original URL or /dashboard');
      return url.startsWith(baseUrl) ? url : `${baseUrl}/login`;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
