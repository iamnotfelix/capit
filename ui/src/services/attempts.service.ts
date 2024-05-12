import { Attempt } from "../models/Attempt";
import axiosService from "../utils/axios";

export const attemptsService = {
  addAttempt,
  getAttemptsMe,
  getAttemptsLeftMe,
};

function addAttempt(imageName: string, token: string) {
  return axiosService
    .post(
      `attempts`,
      { imageName },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      const attempt: Attempt = response.data;
      return attempt;
    });
}

function getAttemptsMe(token: string) {
  return axiosService
    .get(`attempts/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const attempts: Attempt[] = response.data;
      return attempts;
    });
}

function getAttemptsLeftMe(token: string) {
  return axiosService
    .get(`attempts/me/attemptsleft`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const attemptsLeft: number = response.data;
      return attemptsLeft;
    });
}
