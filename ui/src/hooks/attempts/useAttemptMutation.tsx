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
    onSuccess: (attempt, { token }) => {
      const attempts: Attempt[] = queryClient.getQueryData(
        attemptsKeys.attempts(token)
      );
      // invalidate query if there is nothing in the cache
      // if cache empty there may be something in the backend
      if (!attempts || attempts.length == 0) {
        queryClient.invalidateQueries({
          queryKey: attemptsKeys.allWithToken(token),
        });
      } else {
        queryClient.setQueryData(
          attemptsKeys.attempts(token),
          (attempts: Attempt[]) => {
            if (attempts) {
              return [...attempts, attempt];
            }
            return [attempt];
          }
        );
        queryClient.setQueryData(
          attemptsKeys.attemptsLeft(token),
          (attemptsLeft: number) => {
            return attemptsLeft - 1;
          }
        );
      }
    },
  });
};
