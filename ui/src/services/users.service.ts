import { User } from "../models";
import axiosService from "../utils/axios";

export const usersService = {
  getUserById,
  getUserByUsername,
  updateProfileImage,
};

function getUserById(userId: string, token: string) {
  return axiosService
    .get<User>(`users/byuserid/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    });
}

function getUserByUsername(username: string, token: string) {
  return axiosService
    .get<User>(`users/byusername/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    });
}

function updateProfileImage(profileImage: string, token: string) {
  return axiosService
    .put<User>(
      `users/profileimage`,
      { profileImage },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      return response.data;
    });
}
