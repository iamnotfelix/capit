import { useQuery } from "@tanstack/react-query";
import { postsKeys } from "./postsKeys";
import { postsService } from "../../services";

export const useCanPostToday = (token: string) => {
  return useQuery({
    queryKey: postsKeys.canPostToday(token),
    queryFn: () => postsService.getCanPostToday(token),
  });
};
