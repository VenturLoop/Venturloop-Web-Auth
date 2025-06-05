import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';

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
      async authorize(credentials, req) {
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
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // Ensure userStore is initialized (already done at top-level, but good for safety)
      if (!global.userStore) global.userStore = [];

      // For social logins or initial user setup:
      if (user) {
        token.id = user.id; // Persist the user id from provider or authorize function
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image; // Social image

        // Check if this is a new social user
        if (
          account &&
          (account.provider === 'google' || account.provider === 'linkedin')
        ) {
          let existingUser = global.userStore.find(
            (u) => u.email === user.email,
          );
          if (!existingUser) {
            const newSocialUser = {
              id: user.id, // Use ID from provider
              email: user.email,
              name: user.name,
              profileImageUrl: user.image, // Store social image initially
              hashedPassword: null, // No password for social login
              createdAt: new Date().toISOString(),
              isNewSocialUser: true, // Flag to indicate new user from social provider
              location: null,
              birthdate: null,
              onboardingAnswers: null, // Initialize onboardingAnswers
              onboardingCompleted: false, // Initialize onboardingCompleted
            };
            global.userStore.push(newSocialUser);
            // console.log('New social user added to userStore:', newSocialUser.email, newSocialUser); // Debug log removed
            token.isNewUser = true; // Flag for client-side redirection for the very first social sign-in
            token.profileImageUrl = newSocialUser.profileImageUrl;
          } else {
            // User exists in store (could be social or credential)
            // Update image if social login provides a new one
            if (
              account &&
              (account.provider === 'google' || account.provider === 'linkedin')
            ) {
              existingUser.profileImageUrl =
                user.image || existingUser.profileImageUrl;
            }
            token.profileImageUrl = existingUser.profileImageUrl;
            // isNewUser will be set based on isNewSocialUser flag from DB below
          }
        } else if (account && account.provider === 'credentials') {
          // For credential users, user object comes from authorize function
          // We need to ensure token.id is set correctly from this user object
          // and other fields are populated from what authorize returns.
          const dbUser = global.userStore.find((u) => u.email === user.email); // user.email should be reliable
          if (dbUser) {
            token.id = dbUser.id;
            token.profileImageUrl = dbUser.profileImageUrl;
            // isNewUser will be set based on isNewSocialUser flag from DB below
          }
        }
      }

      // After user processing, decisively set isNewUser based on the current state in userStore
      // This covers all cases: new social, existing social, credential user.
      const currentUserFromStore = global.userStore.find(
        (u) => u.email === token.email,
      );
      if (currentUserFromStore) {
        token.isNewUser = !!currentUserFromStore.isNewSocialUser;
        // Also ensure token.id is from store if not already set by new social user branch
        if (!token.id) token.id = currentUserFromStore.id;
        // Ensure latest profile image is on token
        token.picture = currentUserFromStore.profileImageUrl || token.picture; // Prioritize our stored image
        token.profileImageUrl =
          currentUserFromStore.profileImageUrl || token.picture;
      } else if (!account) {
        // This case handles JWT refreshes for users already authenticated, not during initial sign-in.
        // token.email should exist from previous session.
        // No specific 'user' object or 'account' object here.
        // We need to ensure token.isNewUser is still correctly reflecting the DB state.
        const refreshedUserFromStore = global.userStore.find(
          (u) => u.email === token.email,
        );
        if (refreshedUserFromStore) {
          token.isNewUser = !!refreshedUserFromStore.isNewSocialUser;
          token.id = refreshedUserFromStore.id;
          token.picture =
            refreshedUserFromStore.profileImageUrl || token.picture;
          token.profileImageUrl =
            refreshedUserFromStore.profileImageUrl || token.picture;
        }
      }
      // token.sub will also be set by NextAuth to user.id

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like user id from the token.
      if (token) {
        session.user.id = token.id || token.sub; // Ensure id is passed to session
        session.user.isNewUser = token.isNewUser;
        session.user.image = token.profileImageUrl || token.picture; // Use our updated image if available
      }
      return session;
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
