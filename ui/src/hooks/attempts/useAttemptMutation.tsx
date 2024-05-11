import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attemptsService } from "../../services/attempts.service";
import { Attempt } from "../../models/Attempt";
import { attemptsKeys } from "./attemptsKeys";

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
      queryClient.setQueryData(
        attemptsKeys.attempts(variables.token),
        (attempts: Attempt[]) => {
          return [...attempts, attempt];
        }
      );
    },
  });
};
