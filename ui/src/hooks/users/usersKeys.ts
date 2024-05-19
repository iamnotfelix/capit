export const usersKeys = {
  all: ["users"] as const,
  allWithToken: (token: string) => [...usersKeys.all, token] as const,
  userById: (userId: string, token: string) =>
    [...usersKeys.all, token, userId] as const,
  userByUsername: (username: string, token: string) =>
    [...usersKeys.all, token, username] as const,
};
