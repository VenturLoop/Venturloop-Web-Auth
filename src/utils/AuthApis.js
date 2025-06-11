export const signInwithEmail = async (formData) => {
  try {
    const res = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/verify-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      },
    );

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    throw new Error('API call failed');
  }
};

export const handleGoogleSignIn = async (idToken) => {
  try {
    const response = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/app-google-signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Sign-In failed:', data);
      throw new Error(
        data?.error || `Google Sign-In failed with status: ${response.status}`,
      );
    }

    console.log('Backend Google Sign-In response:', data);

    return data;
  } catch (error) {
    console.error('Error sending Google token to backend:', error.message);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

export const handleLinkedInSignIn = async (authCode, redirectUri) => {
  try {
    const response = await fetch('/api/auth/linkedin/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authCode, redirectUri }),
    });

    const data = await response.json();
    console.log(
      'Backend Response (LinkedIn Sign-In from /api/auth/linkedin/exchange):',
      data,
    );
    if (!response.ok) {
      throw new Error(
        data.message ||
          `LinkedIn Sign-In failed with status: ${response.status}`,
      );
    }
    return data;
  } catch (error) {
    console.error('Error during LinkedIn Sign-In:', error);
    // Re-throw or return a structured error
    throw error; // Or return { success: false, message: error.message || 'Error processing LinkedIn Sign-In' };
  }
};

export const SentOPT = async ({ email, verificationCode }) => {
  try {
    const res = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/send-otp',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      },
    );
    return await res.json();
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Server error.' };
  }
};

export const ResentOPT = async (email) => {
  try {
    const res = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/resend',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      },
    );
    return await res.json();
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Server error.' };
  }
};

// 4 Sign Up
export const createAccount = async ({
  name,
  email,
  password,
  birthday,
  location,
  profilePhoto,
}) => {
  console.log(name, email, password, birthday, location, profilePhoto);
  try {
    const res = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          birthday: birthday,
          location: location,
          profilePhoto: profilePhoto,
        }),
      },
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

// 5 login with email and password
export const userLogin = async (email, password) => {
  try {
    const res = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error while updating Item: ' + error);
  }
};

// 6 Forgot Password
export const ForgotPassword = async (email) => {
  try {
    const res = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/forgot',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error while updating Item: ' + error);
  }
};

// 7 Confirm Password
export const ConfirmPassword = async (email, newPassword) => {
  try {
    const res = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/confirm',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, newPassword: newPassword }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error while updating Item: ' + error);
  }
};

// 9 Delete User
export const DeleteUserAccount = async (userId, token) => {
  try {
    const res = await fetch(
      `https://venturloopbackend-v-1-0-9.onrender.com/auth/delete`, // Ensure this is the correct endpoint for delete
      {
        method: 'POST', // Or 'DELETE' if appropriate for the backend
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }), // Ensure body is correct, maybe just userId in URL and empty body for DELETE
      },
    );
    // It's good practice to check response.ok here
    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({
          message: 'Failed to delete user and parse error response',
        }));
      throw new Error(
        errorData.message || `Failed to delete user: ${res.status}`,
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error while deleting user account: ' + error);
    throw error; // Re-throw for the caller to handle
  }
};

// 10
export const submitProfileApi = async ({
  userId,
  token, // Added token
  skillSet,
  industries,
  priorStartupExperience,
  commitmentLevel,
  equityExpectation,
  status = '',
  profilePhoto,
}) => {
  try {
    const res = await fetch(
      `https://venturloopbackend-v-1-0-9.onrender.com/auth/user/${userId}`,
      {
        method: 'POST', // Or 'PUT' if it's an update
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Added Authorization header
        },
        body: JSON.stringify({
          skillSet,
          industries,
          priorStartupExperience,
          commitmentLevel,
          equityExpectation,
          status,
          profilePhoto,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({
          message: 'Failed to save profile and parse error response',
        }));
      console.error(
        'Backend error (submitProfileApi):',
        errorData.message || res.status,
      );
      throw new Error(
        `Error saving user profile: ${errorData.message || res.status}`,
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error during API call (submitProfileApi):', error);
    throw error;
  }
};

// 11 Get user profile data from server
export const getUserDataProfile = async (userId, token) => {
  try {
    const res = await fetch(
      `https://venturloopbackend-v-1-0-9.onrender.com/api/user/${userId}`, // Verify this endpoint, might be /auth/user/
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Added Authorization header
        },
      },
    );
    // It's good practice to check response.ok here
    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({
          message: 'Failed to get user profile and parse error response',
        }));
      throw new Error(
        errorData.message || `Failed to get user profile: ${res.status}`,
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error while fetching user profile: ' + error);
    throw error; // Re-throw for the caller to handle
  }
};

export const getListData = async (title) => {
  try {
    const res = await fetch(
      `https://venturloopbackend-v-1-0-9.onrender.com/admin/get_list_data/${title}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error while updating Item: ' + error);
  }
};
