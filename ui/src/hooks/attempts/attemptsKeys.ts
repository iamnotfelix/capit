export const attemptsKeys = {
  all: ["attempts"] as const,
  attempts: (token: string) => [...attemptsKeys.all, token, "all"] as const,
};
