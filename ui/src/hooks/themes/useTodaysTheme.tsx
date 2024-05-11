import { useQuery } from "@tanstack/react-query";
import { themesKeys } from "./themesKeys";
import { themesService } from "../../services";

export const useTodaysTheme = (token: string) => {
  return useQuery({
    queryKey: themesKeys.today(token),
    queryFn: () => themesService.getTodaysTheme(token),
  });
};
