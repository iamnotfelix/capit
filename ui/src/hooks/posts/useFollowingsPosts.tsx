import { useQuery } from "@tanstack/react-query";
import { postsKeys } from "./postsKeys";
import { postsService } from "../../services";

export const useFollowingsPosts = (token: string) => {
  return useQuery({
    queryKey: postsKeys.followingsPosts(token),
    queryFn: () => postsService.getFollowingsPosts(token),
  });
};
