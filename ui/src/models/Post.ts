import { ThemeGetPost } from "./Theme";
import { UserGetPost } from "./User";

export type Post = {
  id: string;
  imageName: string;
  caption: string;
  score: number;
  created: Date;
  userId: string;
  user: UserGetPost;
  themeId: string;
  theme: ThemeGetPost;
};
