import { useQuery } from "@tanstack/react-query";
import { postsKeys } from "./postsKeys";
import { postsService } from "../../services";

export const useAllPosts = (token: string) => {
  return useQuery({
    queryKey: postsKeys.allPosts(token),
    queryFn: () => postsService.getAllPosts(token),
  });
};
