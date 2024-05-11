import { Attempt } from "../models/Attempt";
import axiosService from "../utils/axios";

export const attemptsService = {
  addAttempt,
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
