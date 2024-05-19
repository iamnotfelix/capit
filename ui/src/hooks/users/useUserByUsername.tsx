import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "./usersKeys";
import { usersService } from "../../services";

export const useUserByUsername = (username: string, token: string) => {
  return useQuery({
    queryKey: usersKeys.userByUsername(username, token),
    queryFn: () => usersService.getUserByUsername(username, token),
  });
};
