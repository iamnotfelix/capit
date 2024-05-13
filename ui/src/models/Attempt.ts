import { Theme } from "./Theme";

export type Attempt = {
  id: string;
  imageName: string;
  caption: string;
  score: number;
  created: Date;
  userId: string;
  themeId: string;
  theme: Theme;
};
