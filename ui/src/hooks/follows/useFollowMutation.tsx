import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followsService } from "../../services";
import { usersKeys } from "../users";
import { followsKeys } from "./followsKeys";
import { postsKeys } from "../posts";

type FollowMutationType = {
  followingId: string;
  token: string;
};

export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followingId, token }: FollowMutationType) =>
      followsService.addFollow(followingId, token),
    onSuccess: (_, { token }) => {
      // TODO: fix invalidation, make more efficient
      queryClient.invalidateQueries({
        queryKey: usersKeys.allWithToken(token),
      });
      queryClient.invalidateQueries({
        queryKey: postsKeys.allWithToken(token),
      });
      queryClient.invalidateQueries({
        queryKey: followsKeys.allWithToken(token),
      });
    },
  });
};
