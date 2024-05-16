export const postsKeys = {
  all: ["posts"] as const,
  allWithToken: (token: string) => [...postsKeys.all, token] as const,
  allPosts: (token: string) => [...postsKeys.all, token, "all"] as const,
  postsByUserId: (userId: string, token: string) =>
    [...postsKeys.all, token, userId] as const,
  canPostToday: (token: string) =>
    [...postsKeys.all, token, "canPostToday"] as const,
};
