export const themesKeys = {
  all: ["themes"] as const,
  allWithToken: (token: string) => [...themesKeys.all, token] as const,
  today: (token: string) => [...themesKeys.all, token, "today"] as const,
};
