import { User } from "./User";

export type AuthContextData = {
  user?: User;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
};
