import { Theme } from "../models";
import axiosService from "../utils/axios";

export const themesService = {
  getTodaysTheme,
};

function getTodaysTheme(token: string) {
  return axiosService
    .get(`themes/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const theme: Theme = response.data;
      return theme;
    });
}
