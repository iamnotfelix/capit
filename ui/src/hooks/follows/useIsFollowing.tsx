import { useQuery } from "@tanstack/react-query";
import { followsKeys } from "./followsKeys";
import { followsService } from "../../services";

export const useIsFollowing = (userId: string, token: string) => {
  return useQuery({
    queryKey: followsKeys.isFollowing(userId, token),
    queryFn: () => followsService.isFollowing(userId, token),
  });
};
