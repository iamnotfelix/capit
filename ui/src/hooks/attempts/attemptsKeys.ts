export const attemptsKeys = {
  all: ["attempts"] as const,
  allWithToken: (token: string) => [...attemptsKeys.all, token] as const,
  attempts: (token: string) => [...attemptsKeys.all, token, "all"] as const,
  attemptsLeft: (token: string) =>
    [...attemptsKeys.all, token, "attemptsLeft"] as const,
};
