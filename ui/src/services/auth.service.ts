import { TokenResponse, User } from "../models";
import axiosService from "../utils/axios";

export const authService = {
  getToken,
  getUserByToken,
  signUp,
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
    .get<User>(`auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    });
}

function signUp(username: string, email: string, password: string) {
  return axiosService
    .post<User>(`auth/signup`, {
      username,
      email,
      password,
    })
    .then((response) => {
      return response.data;
    });
}
