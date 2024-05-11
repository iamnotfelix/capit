export const themesKeys = {
  all: ["themes"] as const,
  today: (token: string) => [...themesKeys.all, "today", token] as const,
};
