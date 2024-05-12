export const attemptsKeys = {
  all: ["attempts"] as const,
  attempts: (token: string) => [...attemptsKeys.all, "all", token] as const,
  attemptsLeft: (token: string) =>
    [...attemptsKeys.all, "attemptsLeft", token] as const,
};
