import { Attempt } from "../models";
import axiosService from "../utils/axios";

export const attemptsService = {
  addAttempt,
  getAttemptsMe,
  getAttemptsLeftMe,
};

function addAttempt(imageName: string, token: string) {
  return axiosService
    .post<Attempt>(
      `attempts`,
      { imageName },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      return response.data;
    });
}

function getAttemptsMe(token: string) {
  return axiosService
    .get<Attempt[]>(`attempts/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    });
}

function getAttemptsLeftMe(token: string) {
  return axiosService
    .get<number>(`attempts/me/attemptsleft`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    });
}
