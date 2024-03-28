import { User } from "./User";

export type Attempt = {
  id: string;
  image: string;
  result: string;
  score: number;
  user: User;
  created: Date;
};
