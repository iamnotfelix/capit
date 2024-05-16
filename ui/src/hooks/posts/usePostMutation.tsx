import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsService } from "../../services";
import { postsKeys } from "./postsKeys";
import { usersKeys } from "../users";

type PostMutationType = {
  attemptId: string;
  token: string;
};

export const usePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attemptId, token }: PostMutationType) =>
      postsService.addPost(attemptId, token),
    onSuccess: (_, { token }) => {
      queryClient.invalidateQueries({
        queryKey: postsKeys.allWithToken(token),
      });
      queryClient.invalidateQueries({
        queryKey: usersKeys.allWithToken(token),
      });

      // set canPostToday to false
      queryClient.setQueryData(postsKeys.canPostToday(token), false);
    },
  });
};
