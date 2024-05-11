export interface User {
  id: string;
  username: string;
  email: string;
  score: number;
  allowedAttempts: number;
  isAdmin: boolean;
  created: Date;
}
