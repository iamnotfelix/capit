export type User = {
  id: string;
  username: string;
  email: string;
  score: number;
  allowedAttempts: number;
  isAdmin: boolean;
  created: Date;
};

export type UserGetPost = {
  id: string;
  username: string;
};
