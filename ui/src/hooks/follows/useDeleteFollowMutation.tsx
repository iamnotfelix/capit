import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followsService } from "../../services";
import { usersKeys } from "../users";
import { followsKeys } from "./followsKeys";

type DeleteFollowMutationType = {
  followingId: string;
  token: string;
};

export const useDeleteFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followingId, token }: DeleteFollowMutationType) =>
      followsService.deleteFollow(followingId, token),
    onSuccess: (_, { token }) => {
      // TODO: fix invalidation, make more efficient
      queryClient.invalidateQueries({
        queryKey: usersKeys.allWithToken(token),
      });
      queryClient.invalidateQueries({
        queryKey: followsKeys.allWithToken(token),
      });
    },
  });
};
