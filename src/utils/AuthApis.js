
export const userLogin = async (email, password) => {
  try {
    const res = await fetch(
      "https://venturloopbackend-v-1-0-9.onrender.com/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error while updating Item: " + error);
  }
};