import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "./usersKeys";
import { usersService } from "../../services";

export const useUserById = (userId: string, token: string) => {
  return useQuery({
    queryKey: usersKeys.user(userId, token),
    queryFn: () => usersService.getUserById(userId, token),
  });
};
