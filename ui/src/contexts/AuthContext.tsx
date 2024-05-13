import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextData, Auth } from "../models";
import { authService } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState<Auth>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDataFromStorage();
  }, []);

  async function loadDataFromStorage(): Promise<void> {
    try {
      const authDataSerialized = await AsyncStorage.getItem("@AuthData");
      if (authDataSerialized) {
        const _auth: Auth = JSON.parse(authDataSerialized);
        setAuth(_auth);
      }
    } catch (error) {}
    setIsLoading(false);
  }

  const signIn = async () => {
    setIsLoading(true);

    const tokenResponse = await authService.getToken(
      // "iliescuandrei",
      "iliescuandrei",
      "password"
    );
    const user = await authService.getUserByToken(tokenResponse.accessToken);

    const _auth: Auth = {
      tokenResponse,
      user,
    };
    setAuth(_auth);

    setIsLoading(false);

    // TODO: create a type to store all the keys from the async storage
    // TODO: replace this async storage for a more secure one to store the token
    AsyncStorage.setItem("@AuthData", JSON.stringify(_auth));
  };

  const signOut = async () => {
    setAuth(undefined);
    AsyncStorage.removeItem("@AuthData");
  };

  const isAutheticated = () => {
    return !!auth;
  };

  return (
    <AuthContext.Provider
      value={{ auth, isLoading, signIn, signOut, isAutheticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
