export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  score: number;
  allowed_attempts: number;
  created: Date;
}
