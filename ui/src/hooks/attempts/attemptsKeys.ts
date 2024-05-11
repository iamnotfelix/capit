export const attemptsKeys = {
  all: ["attempts"] as const,
  attempts: (token: string) => [...attemptsKeys.all, "all", token] as const,
};
