import { Theme } from "../models";
import axiosService from "../utils/axios";

export const themesService = {
  getTodaysTheme,
};

function getTodaysTheme(token: string) {
  return axiosService
    .get<Theme>(`themes/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    });
}
