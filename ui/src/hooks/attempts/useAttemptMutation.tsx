import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Attempt } from "../../models";
import { attemptsKeys } from "./attemptsKeys";
import { attemptsService } from "../../services";

type AttemptMutationType = {
  imageName: string;
  token: string;
};

export const useAttemptMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageName, token }: AttemptMutationType) =>
      attemptsService.addAttempt(imageName, token),
    onSuccess: (_, { token }) => {
      queryClient.invalidateQueries({
        queryKey: attemptsKeys.attempts(token),
      });

      queryClient.setQueryData(
        attemptsKeys.attemptsLeft(token),
        (attemptsLeft: number) => {
          return attemptsLeft - 1;
        }
      );
      // TODO
      // invalidate query if there is nothing in the cache
      // if cache empty there may be something in the backend
    },
  });
};
