import { User } from "../models";
import axiosService from "../utils/axios";

export const usersService = {
  getUserById,
};

function getUserById(userId: string, token: string) {
  return axiosService
    .get<User>(`users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    });
}
