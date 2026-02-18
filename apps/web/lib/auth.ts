import axios from "axios";

export const signUp = async ({name, email, password, country}:{name: string, email: string, password: string, country: string}) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL! + "/user",
      {
        email,
        password,
        name,
        country
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data; // { message: email, success: true }
  } catch (error) {
    console.error("Sign up error:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Sign up failed");
    }
    throw error;
  }
};

export const signOutUser = async () => {
  localStorage.removeItem("access_token");
};

export const signIn = async ({email, password}: { email: string, password: string}) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL! + "/auth/login",
      {
        email,
        password
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }

    return {
      success: true,
      access_token: data.access_token
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Signin Failed";
    return {
      success: false,
      message: errorMessage 
    }
  }
}