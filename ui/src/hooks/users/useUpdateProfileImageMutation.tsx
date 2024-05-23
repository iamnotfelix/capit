import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../services";
import { usersKeys } from "./usersKeys";

type UpdateProfileImageMutationType = {
  profileImage: string;
  token: string;
  currentUserId: string;
};

export const useUpdateProfileImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ profileImage, token }: UpdateProfileImageMutationType) =>
      usersService.updateProfileImage(profileImage, token),
    onSuccess: (updatedUser, { token, currentUserId }) => {
      queryClient.setQueryData(
        usersKeys.userById(currentUserId, token),
        updatedUser
      );
      // queryClient.invalidateQueries({
      //   queryKey: usersKeys.allWithToken(token),
      // });
    },
  });
};
