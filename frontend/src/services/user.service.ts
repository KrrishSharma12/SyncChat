import { api } from "./axiosInstance";

interface SearchUser {
  id: string;
  username: string;
  profilePic: string | null;
}

interface SearchUsersResponse {
  users: SearchUser[];
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  profilePic?: File;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const searchUsers = async (search: string): Promise<SearchUser[]> => {
  try {
    const response = await api.get<SearchUsersResponse>(
     `/user/search?query=${encodeURIComponent(search)}`
    );

    if (response.status === 200) {
      return response.data.users;
    }

    return [];
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

export const getUser = async (userId: string): Promise<SearchUser | null> => {
  try {
    const response = await api.get<{ success: boolean; user: SearchUser }>(`/user/${userId}`);
    return response.data.user;
  } catch (error) { 
    console.error("Error fetching user:", error);
    return null;
  }
};






export const updateProfile = async (
  payload: UpdateProfilePayload
) => {

  const formData = new FormData();

  if (payload.username !== undefined) {
    formData.append(
      "username",
      payload.username
    );
  }

  if (payload.email !== undefined) {
    formData.append(
      "email",
      payload.email
    );
  }

  if (payload.profilePic) {
    formData.append(
      "profilePic",
      payload.profilePic
    );
  }


  const response = await api.put(
    "/user/profile",
    formData
  );


  return response.data;
};





export const changePassword = async (
  payload: ChangePasswordPayload
) => {

  const response = await api.patch(
    "/user/password",
    payload
  );

  return response.data;
};