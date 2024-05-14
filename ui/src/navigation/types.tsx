import type { StackScreenProps } from "@react-navigation/stack";

// Parameter list types

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Welcome: undefined;
};

export type MainStackParamList = {
  Camera: undefined;
  Attempt: undefined;
  AllAttempts: undefined;
  Home: undefined;
  Profile: undefined;
};

// Prop types

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  StackScreenProps<MainStackParamList, T>;

// Specifying default types
// The 'RootParamList' interface lets React Navigation know about the params accepted by your root navigator.
// Here we extend the type MainStackParamList because that's the type of params for our stack navigator at the root.

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}
