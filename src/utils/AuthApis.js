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

export const sendTokenToBackend = async (idToken) => {
  try {
    const response = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/google-signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      },
    );

    const data = await response.json();
    console.log('Backend Response:', data);
  } catch (error) {
    console.error('Error sending token to backend:', error);
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
export const DeleteUserAccount = async (userId) => {
  try {
    const res = await fetch(
      'https://venturloopbackend-v-1-0-9.onrender.com/auth/delete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error while updating Item: ' + error);
  }
};

// 10
export const submitProfileApi = async ({
  userId,
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      // Log the response from the backend to get error details
      const errorData = await res.json();
      console.error('Backend error:', errorData.message);
      throw new Error(`Error saving user profile: ${errorData.message}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error during API call:', error);
    throw error;
  }
};

// 11 Get user profile data from server
export const getUserDataProfile = async (userId) => {
  try {
    const res = await fetch(
      `https://venturloopbackend-v-1-0-9.onrender.com/api/user/${userId}`,
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


export const getListData = async (title) => {
  try {
    const res = await fetch(
      `https://venturloopbackend-v-1-0-9.onrender.com/admin/get_list_data/${title}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error while updating Item: " + error);
  }
};