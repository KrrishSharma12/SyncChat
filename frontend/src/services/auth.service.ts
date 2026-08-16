import { api } from "./axiosInstance";
import { useAuthStore } from "../store/authStore";


type signupResponse = {

  "success": boolean,
  "message": string,
  "email": string

}
type verifyResponse = {
  "success": boolean,
  "message": string
}
type loginResponse = {
  "message": string,
  "user": {
    id: string,
    username: string,
    email: string,
    profile: string | null
  },
  "success": boolean

}

export const userSignup = async (username: string, email: string, password: string, profileUrl: File) => {
  const formData = new FormData();
console.log("hello");

  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password.toString());
  formData.append("profileUrl", profileUrl);
  useAuthStore.setState({ isLoading: true });
  try {
    const response = await api.post<signupResponse>("/auth/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } finally {
    useAuthStore.setState({ isLoading: false });
  }
}


export const verifyEmail = async (email: string, otp: string) => {
  const response = await api.post<verifyResponse>("/auth/verify", { email, otp });
  return response.data;
}

export const userLogin = async (email: string, password: string) => {
  useAuthStore.setState({ isLoading: true });
console.log("hye");

  try {
    const response = await api.post<loginResponse>("/auth/login", { email, password });
    useAuthStore.setState({ isLoading: false });
    return response.data;
  } catch (error: unknown) {
    console.error("Error logging in:", error);
    useAuthStore.setState({ isLoading: false });
    return {
      message: "Login failed",
      user: null,
      success: false
    }
  }


}



export const getCurrentUser = async () => {
  
  try {
    const response = await api.get<loginResponse>("/auth/getme");
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching current user:", error);
    return {
      message: "Failed to fetch current user",
      user: null
    }
  }
}

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error: unknown) {
    console.error("Error logging out:", error);
    return {
      message: "Logout failed",
      success: false
    }
  }
}


export const googleLogin = async ( code: string) => {

  const response = await api.post(
    "/auth/google",
    {
      code,
    }
  );

  return response.data;
};