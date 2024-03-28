import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { MainNavigator } from "./navigators/MainNavigator";
import { AuthNavigator } from "./navigators/AuthNavigator";

export const Router = () => {
  const { user, isLoading } = useAuth();

  // TODO: fix this loading so that it does not get stuck in here when first starting the app
  // if (isLoading) {
  //   return <LoadingIndicator />;
  // }

  // TODO: when auth with tokens is implemented, change the condiational rendering
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
