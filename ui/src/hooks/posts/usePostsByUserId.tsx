import { useQuery } from "@tanstack/react-query";
import { postsKeys } from "./postsKeys";
import { postsService } from "../../services";

export const usePostByUserId = (userId: string, token: string) => {
  return useQuery({
    queryKey: postsKeys.postsByUserId(userId, token),
    queryFn: () => postsService.getPostsByUserId(userId, token),
  });
};
