import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Attempt } from "../../models/Attempt";
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
    onSuccess: (attempt, variables) => {
      const attempts: Attempt[] = queryClient.getQueryData(
        attemptsKeys.attempts(variables.token)
      );

      // invalidate query if there is nothing in the cache
      // if cache empty there may be something in the backend
      if (!attempts || attempts.length == 0) {
        queryClient.invalidateQueries({
          queryKey: attemptsKeys.attempts(variables.token),
        });
        queryClient.invalidateQueries({
          queryKey: attemptsKeys.attemptsLeft(variables.token),
        });
      } else {
        queryClient.setQueryData(
          attemptsKeys.attempts(variables.token),
          (attempts: Attempt[]) => {
            if (attempts) {
              return [...attempts, attempt];
            }
            return [attempt];
          }
        );
        queryClient.setQueryData(
          attemptsKeys.attemptsLeft(variables.token),
          (attemptsLeft: number) => {
            return attemptsLeft - 1;
          }
        );
      }
    },
  });
};
