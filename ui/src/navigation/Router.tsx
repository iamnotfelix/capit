import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { MainNavigator } from "./navigators/MainNavigator";
import { AuthNavigator } from "./navigators/AuthNavigator";

export const Router = () => {
  const { auth } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {auth?.tokenResponse ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
