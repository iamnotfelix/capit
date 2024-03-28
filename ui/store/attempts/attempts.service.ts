import axiosService from "../../src/utils/axios";

export const getAttemptsByDate = (userId: string, date: Date) => {
  return axiosService.get(`attempts?date=${date.toString()}&`);
};
