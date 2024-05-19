export const followsKeys = {
  all: ["follows"] as const,
  allWithToken: (token: string) => [...followsKeys.all, token] as const,
  isFollowing: (userId, token: string) =>
    [...followsKeys.all, token, "isFollowing", userId] as const,
};
