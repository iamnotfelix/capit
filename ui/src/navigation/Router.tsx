import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { DarkTheme, NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";

export const Router = () => {
  const { auth, signOut } = useAuth();

  useEffect(() => {
    if (auth) {
      var intervalId = setInterval(() => {
        authService
          .getUserByToken(auth?.tokenResponse.accessToken)
          .catch((error) => {
            if (error?.response.status === 401) {
              signOut();
            }
          });
      }, 5 * 60 * 1000);
    }
    return () => clearInterval(intervalId);
  }, [auth]);

  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="auto" />
      {auth?.tokenResponse ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
