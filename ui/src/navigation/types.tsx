import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// Parameter list types

export type AuthStackParamList = {
  SignIn: undefined;
};

export type MainTabParamList = {
  CameraTab: NavigatorScreenParams<CameraStackParamList>;
  HomeTab: undefined;
  ProfileTab: undefined;
};

export type CameraStackParamList = {
  Camera: undefined;
  Attempt: undefined;
  AllAttempts: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

// Prop types

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  StackScreenProps<MainTabParamList, T>;

export type CameraStackScreenProps<T extends keyof CameraStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<CameraStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  StackScreenProps<ProfileStackParamList, T>;

// Specifying default types
// The 'RootParamList' interface lets React Navigation know about the params accepted by your root navigator.
// Here we extend the type MainTabParamList because that's the type of params for our stack navigator at the root.

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainTabParamList {}
  }
}
