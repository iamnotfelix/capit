export const usersKeys = {
  all: ["users"] as const,
  allWithToken: (token: string) => [...usersKeys.all, token] as const,
  user: (userId: string, token: string) =>
    [...usersKeys.all, token, userId] as const,
};
