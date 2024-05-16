import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsService } from "../../services";
import { postsKeys } from "./postsKeys";

type DeletePostMutationType = {
  postId: string;
  token: string;
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, token }: DeletePostMutationType) =>
      postsService.deletePostById(postId, token),
    onSuccess: (_, { token }) => {
      // TODO: remove the post by hand without invalidating the query for efficiency
      queryClient.invalidateQueries({
        queryKey: postsKeys.allWithToken(token),
      });
    },
  });
};
