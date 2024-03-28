import React, { createContext, useContext, useState } from "react";
import { AuthContextData, User } from "../models";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User>();

  const [isLoading, setIsLoading] = useState(true);

  const signIn = async () => {
    // const _user = await authService.signIn(
    // );

    // TODO: change this when sign in is implemented
    setIsLoading(true);
    const _user: User = {
      id: "ce3066a9-5117-4dd9-ac18-b4002359b912",
      username: "iliescuandrei",
      email: "andrei.iliescu03@gmail.com",
      password: "password",
      score: 0,
      allowed_attempts: 3,
      created: new Date(),
    };

    setUser(_user);
    setIsLoading(false);
  };

  const signOut = async () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
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
