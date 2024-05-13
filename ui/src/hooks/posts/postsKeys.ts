export const postsKeys = {
  all: ["posts"] as const,
  allPosts: (token: string) => [...postsKeys.all, "all", token] as const,
  canPostToday: (token: string) =>
    [...postsKeys.all, "canPostToday", token] as const,
};
