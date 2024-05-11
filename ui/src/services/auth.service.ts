import { TokenResponse, User } from "../models";
import axiosService from "../utils/axios";

export const authService = {
  getToken,
  getUserByToken,
};

function getToken(username: string, password: string) {
  return axiosService
    .post(
      `auth/token`,
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      const tokenResponse: TokenResponse = {
        accessToken: response.data["access_token"],
        tokenType: response.data["token_type"],
      };
      return tokenResponse;
    });
}

function getUserByToken(token: string) {
  return axiosService
    .get(`auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const user: User = response.data;
      return user;
    });
}
