import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { MainNavigator } from "./MainNavigator";
import { AuthNavigator } from "./AuthNavigator";
import { DarkTheme } from "@react-navigation/native";

export const Router = () => {
  const { auth } = useAuth();

  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="auto" />
      {auth?.tokenResponse ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
