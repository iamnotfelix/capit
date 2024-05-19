import { User } from "../models";
import axiosService from "../utils/axios";

export const usersService = {
  getUserById,
  getUserByUsername,
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
