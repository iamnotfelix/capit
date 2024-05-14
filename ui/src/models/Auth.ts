import { User } from "./User";

export type AuthContextData = {
  auth?: Auth;
  isLoading: boolean;
  signUp: (username: string, email: string, password: string) => Promise<User>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  isAutheticated: () => boolean;
};

export type Auth = {
  tokenResponse: TokenResponse;
  user: User;
};

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
};
