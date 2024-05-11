import { User } from "./User";

export type AuthContextData = {
  auth?: Auth;
  isLoading: boolean;
  signIn: () => Promise<void>;
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
