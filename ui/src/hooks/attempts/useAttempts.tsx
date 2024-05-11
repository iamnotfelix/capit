import { useQuery } from "@tanstack/react-query";
import { attemptsKeys } from "./attemptsKeys";
import { attemptsService } from "../../services";

export const useAttempts = (token: string) => {
  return useQuery({
    queryKey: attemptsKeys.attempts(token),
    queryFn: () => attemptsService.getAttemptsMe(token),
  });
};
