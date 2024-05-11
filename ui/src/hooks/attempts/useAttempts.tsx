import { useQuery } from "@tanstack/react-query";
import { attemptsService } from "../../services/attempts.service";
import { attemptsKeys } from "./attemptsKeys";

export const useAttempts = (token: string) => {
  return useQuery({
    queryKey: attemptsKeys.attempts(token),
    queryFn: () => attemptsService.getAttemptsMe(token),
  });
};
