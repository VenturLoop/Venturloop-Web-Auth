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
          } else if (account.provider === 'linkedin') {
            const linkedInRedirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`;
            if (account.code) {
              const backendResponse = await handleLinkedInSignIn(
                account.code,
                linkedInRedirectUri,
              );
              if (
                backendResponse &&
                backendResponse.token &&
                backendResponse.userId
              ) {
                token.customBackendToken = backendResponse.token;
                token.customBackendUserId = backendResponse.user._id;
                token.requiresRedirectToAddBasicDetails =
                  backendResponse.isNewUser === true;
                token.isNewUser = backendResponse.isNewUser === true;

                console.log(
                  'LinkedIn sign-in successful, backend token stored in JWT.',
                );
              } else {
                console.error(
                  'LinkedIn sign-in: Backend response missing token or userId',
                  backendResponse,
                );
                token.error = 'LinkedInBackendError'; // Specific error
              }
            } else {
              console.error(
                'LinkedIn sign-in: authorization code (account.code) missing.',
              );
              token.error = 'LinkedInAuthCodeMissing';
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
    async session({ session, token }) {
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
