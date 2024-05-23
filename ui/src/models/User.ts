import { Follower, Following } from "./Follow";

export type User = {
  id: string;
  username: string;
  email: string;
  score: number;
  allowedAttempts: number;
  isAdmin: boolean;
  created: Date;
  profileImage: string;
  followers: Follower[];
  followings: Following[];
};

export type UserGetPost = {
  id: string;
  username: string;
  profileImage: string;
};
