import { useQuery } from "@tanstack/react-query";
import { attemptsKeys } from "./attemptsKeys";
import { attemptsService } from "../../services";

export const useAttemptsLeft = (token: string) => {
  return useQuery({
    queryKey: attemptsKeys.attemptsLeft(token),
    queryFn: () => attemptsService.getAttemptsLeftMe(token),
  });
};
